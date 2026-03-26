---
title: "Debugging Claude Code's Silent Telemetry Failure on NixOS"
date: "2026-03-26"
categories: ["nix"]
tags: ["nixos", "claude-code", "opentelemetry", "datadog", "blocky", "dns", "debugging"]
excerpt: "How a DNS ad blocker silently ate OpenTelemetry exports, and the rabbit hole I went down before finding it."
published: true
readingTime: "10 min read"
---

My team uses [Claude Code](https://claude.ai/code) as a daily driver for AI-assisted development. We push OpenTelemetry configuration to every engineer's machine via managed settings so that each session exports metrics and logs to Datadog. The setup is straightforward: a `remote-settings.json` file with the OTEL env vars, and Datadog lights up with telemetry from every session across the org.

Except mine. On my NixOS workstation, zero events ever arrived in Datadog. No logs, no metrics, nothing. Every teammate's data was flowing (macOS, Linux, npm installs, Nix installs) but my machine was a black hole.

I sat down with Claude Code to figure out why. What followed was a multi-hour debugging session where Claude Code helped me investigate its own internals, build and discard multiple hypotheses, and ultimately find a root cause I should have checked first.

## The Missing Packages Theory

The first thing I asked Claude Code to investigate was the Nix package itself. We use the [numtide/llm-agents.nix](https://github.com/numtide/llm-agents.nix) flake, which provides Claude Code as a standalone Bun binary. My initial theory was that this packaging approach simply didn't include the OpenTelemetry dependencies.

The evidence looked damning. Searching the Nix store path for anything OTEL-related came up completely empty:

```bash
find /nix/store/*-claude-code-*/ -name "*.node"          # nothing
find /nix/store/*-claude-code-*/ -path "*opentelemetry*"  # nothing
find /nix/store/*-claude-code-*/ -path "*protobuf*"       # nothing
```

No `.node` files, no `opentelemetry` directories, no `protobuf` libraries. Compared to the npm-installed version my macOS teammates use, where `node_modules` is full of OTEL packages, it seemed obvious that the Nix package was just missing them.

Claude Code disproved this by running `strings` against the Bun binary itself:

```bash
strings /nix/store/*-claude-code-*/bin/.claude-wrapped | grep -c "opentelemetry"
# 161
```

161 references to `opentelemetry` inside the executable, including the full OTLP HTTP/protobuf and HTTP/JSON exporter implementations. The OTEL SDK wasn't missing; it was compiled directly into the binary. Those `find` commands returned nothing because there are no separate files; everything lives inside a single 230MB executable.

## The Bun Runtime Theory

If the code was bundled, maybe the problem was the runtime. Teammates on macOS run Claude Code via npm, which uses Node.js. The Nix package runs a Bun standalone binary. Maybe Bun has incompatibilities with the OTEL HTTP transport that prevent data from actually being sent.

Claude Code went ahead and built a complete alternative. It created a Nix overlay that fetches the npm tarball, extracts `cli.js`, patches the vendor native addons with `autoPatchelfHook`, and wraps everything with Node.js:

```nix
claude-code-node = final.stdenv.mkDerivation {
  pname = "claude-code";
  version = "2.1.84";

  src = final.fetchzip {
    url = "https://registry.npmjs.org/@anthropic-ai/claude-code/-/claude-code-2.1.84.tgz";
    hash = "sha256-sUlqdQS8d9vha94d+/mwn+V88fiR0pzZBWezjM8Zl3Y=";
  };

  nativeBuildInputs = [ final.makeWrapper final.autoPatchelfHook ];
  buildInputs = [ final.stdenv.cc.cc.lib final.alsa-lib ];

  installPhase = ''
    mkdir -p $out/lib/claude-code $out/bin
    cp -r . $out/lib/claude-code/

    makeWrapper ''${final.nodejs}/bin/node $out/bin/claude \
      --argv0 claude \
      --add-flags "$out/lib/claude-code/cli.js" \
      --set DISABLE_AUTOUPDATER 1 \
      --set DISABLE_INSTALLATION_CHECKS 1 \
      --prefix PATH : ''${final.lib.makeBinPath [ final.bubblewrap final.socat ]}
  '';
};
```

It worked: the build succeeded, `claude --version` returned the right output, and all the platform-specific binaries in `vendor/` were properly linked.

Before committing to this approach, I asked Claude Code to check Datadog for any Linux users with working telemetry. This was the turning point. It queried the Datadog logs API and found a colleague running the exact same NixOS kernel (`6.18.19`) with working telemetry from the stock Bun binary. Same OS, same packaging, same Nix flake, same binary. Their telemetry worked. Mine didn't. This wasn't a packaging or runtime issue. It was something specific to my machine. We reverted the overlay.

## The Startup Ordering Theory

Claude Code then did something I didn't expect: it started reverse-engineering its own binary to trace the telemetry initialization sequence. By extracting and analyzing the minified JavaScript from the Bun executable, it mapped out the startup flow and found a critical branching point.

The telemetry bootstrap function checks whether the user has an enterprise/team OAuth session. If yes, it waits for `remote-settings.json` to load, applies the env vars from that file to `process.env`, and then initializes the OTEL SDK. If the check fails, it skips the settings application entirely and initializes telemetry immediately, meaning the OTEL env vars from managed settings never make it into `process.env` before the SDK reads them.

```javascript
// Extracted from the minified binary
function DU$() {
  if (ZbA()) {
    // Wait for remote managed settings, apply env, THEN init telemetry
    NN$().then(async () => { VU(); await GeA(); })
  } else {
    // Init telemetry immediately — remote settings env NOT applied
    GeA().catch(...)
  }
}
```

<aside class="pullquote">Claude Code checked /proc/$PPID/environ and found zero OTEL variables in its own process, while env | grep OTEL from its Bash tool showed all of them.</aside>

This discrepancy was revealing. The Bash tool sources the user's shell profile, which loads `~/.env` and other dotfiles. But the claude-code process itself only has what was in the environment when it launched. The OTEL vars existed in my shell but weren't making it into the process that needed them.

```bash
# What the process actually has (OS-level)
cat /proc/$PPID/environ | tr '\0' '\n' | grep OTEL
# (nothing)

# What the Bash tool sees (shell profile sourced)
env | grep OTEL
# OTEL_METRICS_EXPORTER=otlp
# OTEL_LOGS_EXPORTER=otlp
# ... all 8 vars present
```

I added the OTEL vars directly to `~/.env` as a workaround:

```bash
# ~/.env
export CLAUDE_CODE_ENABLE_TELEMETRY="1"
export OTEL_METRICS_EXPORTER="otlp"
export OTEL_LOGS_EXPORTER="otlp"
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT="https://otlp.datadoghq.com/v1/metrics"
export OTEL_EXPORTER_OTLP_METRICS_PROTOCOL="http/protobuf"
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT="https://http-intake.logs.datadoghq.com/v1/logs"
export OTEL_EXPORTER_OTLP_LOGS_PROTOCOL="http/protobuf"
export OTEL_EXPORTER_OTLP_HEADERS="dd-api-key=<REDACTED>"
```

Restarted Claude Code, confirmed the vars were now in `/proc/$PPID/environ`, waited for the periodic export interval to fire. Checked Datadog.

Still nothing.

## The Actual Problem

At this point I had correct OTEL vars in the process environment, a confirmed working Bun binary, and a teammate on the same OS with functioning telemetry. The only thing I hadn't tested was whether the HTTP requests were actually reaching Datadog.

Claude Code ran `curl -v` against the Datadog logs intake endpoint:

```
$ curl -v "https://http-intake.logs.datadoghq.com/v1/logs" -H "dd-api-key: <KEY>" -d "test"

* SSL connection using TLSv1.3
* Server certificate:
*   subject: CN=cg.garrisonsbygrace.com    # ← not Datadog
*   subjectAltName does not match hostname
```

The TLS handshake came back with a certificate for my personal domain, not Datadog. DNS resolution confirmed it:

```bash
dig +short http-intake.logs.datadoghq.com
# 0.0.0.0
```

My NixOS workstation runs [Blocky](https://github.com/0xERR0R/blocky) as a network-wide DNS ad blocker with the [Hagezi Pro](https://github.com/hagezi/dns-blocklists) and [StevenBlack](https://github.com/StevenBlack/hosts) blocklists. These lists categorize Datadog's log intake hostname as a tracking domain and resolve it to `0.0.0.0`. The OTEL SDK was doing everything right (initializing exporters, batching events, attempting HTTP requests) but every request silently failed because DNS pointed at nothing.

The OTEL SDK is designed to fail silently. Telemetry should never crash your application. That design decision is correct, but it means you get zero feedback when your DNS blocker eats your observability data.

## The Fix (After a Few Tries)

The fix itself wasn't one-shot either. Blocky's allowlist configuration has some quirks that tripped us up.

First attempt: Claude Code created a separate allowlist group name that didn't match any denylist group:

```nix
allowlists = {
  datadog = [
    "|/^.*\\.datadoghq\\.com$/"
  ];
};
```

This did nothing. In Blocky, allowlist group names need to match the denylist group names they're overriding. A group called `datadog` doesn't correspond to any denylist, so it's ignored entirely.

Second attempt: correct group name, inline regex format with `|` prefix:

```nix
allowlists = {
  ads = [
    "|/^.*\\.datadoghq\\.com$/"
  ];
};
```

This also failed. Checking `journalctl -u blocky` revealed why:

```
ERROR list_cache: cannot open source: failed to open file
  '|http-intake.logs.datadoghq.com': no such file or directory
```

Blocky was interpreting the inline entries as file paths, not regex patterns. At least in the version packaged by nixpkgs, the `|` prefix inline format doesn't work.

Third attempt: plain domain strings directly in the list. Same file path error.

Fourth attempt: write the domains to an actual file and reference it with `file://`. This is where Nix shines. Rather than managing a file outside the Nix store, `pkgs.writeText` creates a reproducible file in the store that the Blocky config can reference:

```nix
allowlists = let
  datadogAllowlist = pkgs.writeText "blocky-datadog-allowlist.txt" ''
    http-intake.logs.datadoghq.com
    otlp.datadoghq.com
  '';
in {
  ads = [ "file://${datadogAllowlist}" ];
  security = [ "file://${datadogAllowlist}" ];
};
```

The allowlist needs to be applied to each denylist group separately. Since the domain could be caught by either the `ads` group (Hagezi Pro, StevenBlack) or the `security` group (Hagezi TIF), both need the allowlist entry. Two mistakes in one config block: wrong group name, then wrong entry format.

After rebuilding and switching, DNS resolved correctly:

```bash
$ dig +short http-intake.logs.datadoghq.com
3.233.158.40
3.233.158.39
3.233.158.41

$ npx @ctdio/datadog-cli logs search \
    --query 'service:claude-code @user.email:jordan.garrison*' --from 5m
# Logs (5)
```

Datadog immediately started receiving events. I also confirmed that the `~/.env` workaround was unnecessary. I removed the OTEL vars from `~/.env`, restarted Claude Code, and logs kept flowing. Once DNS was unblocked, the managed settings path worked on its own. The startup ordering was fine all along; the requests were just going nowhere.

## Reflections

The entire debugging session, from the initial "missing packages" hypothesis through building a Node.js overlay, reverse-engineering the Bun binary, tracing the startup sequence, and finally running `curl -v`, was done collaboratively with Claude Code. It analyzed its own binary, built and reverted its own replacement, queried Datadog, and ultimately ran the command that cracked the case. There's something uniquely strange about an AI agent helping you debug why its own telemetry doesn't work by introspecting its own compiled internals.

The lesson I keep relearning is that the obvious-seeming root cause is usually wrong, and the actual root cause is usually something environmental that you'd find in five minutes if you started at the network layer instead of the application layer. DNS ad blockers are a constant source of these silent failures. If you run Blocky, Pi-hole, or any DNS-level blocker alongside observability tooling, check your allowlists before you check anything else.

The other lesson is more specific to debugging on NixOS: `cat /proc/$PID/environ` is the only reliable way to see what environment a process actually has. Shell builtins like `env` reflect the shell's environment, not the target process. On NixOS, where processes launch through wrapper scripts and systemd units that may not source your dotfiles, the gap between "what my shell has" and "what the process has" can be significant.
