---
title: "Making Brave's Web Speech API work on NixOS"
date: "2026-05-12"
categories: ["nix"]
tags: ["nixos", "brave", "chromium", "speech-dispatcher", "web-speech-api", "tts", "debugging"]
excerpt: "I was adding a typing game to a webapp I made for my kids. Audio worked on every device except my dev box. The fix took three patches and uncovered a nixpkgs bug that's been open since 2018."
published: true
readingTime: "10 min read"
---

I was adding a typing game to a little webapp I made for my kids. Big rainbow letter on screen, voice reads it out, repeat. Letter recognition for the toddler, long-form narration for the kindergartner who's reading past her independent level. The Web Speech API does the heavy lifting in about 30 lines of code. (More on the webapp itself in a follow-up post.)

It worked on the Mac. It worked on the iPad. It did not work on my NixOS workstation, which is where I was building it. It also did not work on the girls' mini NixOS box at the little table next to my desk, which is the machine they actually use when they're home with me and I'm working. Every utterance fired `synthesis-failed` and `speechSynthesis.getVoices()` returned `[]`.

What followed was a multi-hour rabbit hole that ended with three patches, a managed-policy file, and a much clearer understanding of how Linux desktops do text-to-speech. The short version: TTS in the browser on Linux is held together with string, and most of the string is missing on NixOS by default.

## What the Web Speech API actually does on Linux

`speechSynthesis.speak(utterance)` looks like it does the audio itself. It doesn't. On Linux it's a thin shim over [speech-dispatcher](https://devel.freebsoft.org/speechd), a daemon that brokers requests from clients (browsers, screen readers, Orca) to output modules (espeak-ng, pico, flite, piper). The browser dlopens `libspeechd.so.2`, opens a Unix socket to the daemon, and asks it to speak. The daemon picks an output module, the module renders audio, PipeWire or PulseAudio plays it.

macOS and Windows ship a TTS subsystem the OS owns. Linux delegates the whole problem to userspace. That means on a stock Linux desktop, every layer in that stack has to be installed, running, and talking to each other. If any link breaks, you get exactly the silent failure I was looking at.

NixOS, being NixOS, ships none of it by default. That's where my problem started, but not where it ended.

## First patch: enable the daemon

The obvious first move. NixOS has a `services.speechd.enable` option that wires up speech-dispatcher as a per-user, socket-activated daemon and pulls espeak-ng in as the default output module.

```nix
# modules/nixos/audio/speech-dispatcher.nix
{ ... }: {
  services.speechd.enable = true;
}
```

Built, switched, ran `spd-say "hello world"` from the terminal. Audio came out. `spd-say -L` returned six voices.

Restarted Brave. `speechSynthesis.getVoices()` returned `[]`.

Same problem. The daemon was healthy, my own CLI talked to it fine, but Brave was deaf. Did a sanity check in Firefox. Firefox worked perfectly on the same machine.

That's the kind of result that tells you it's not a system problem. It's a packaging problem.

## Second patch: get libspeechd into Brave's library path

I ran `ldd` on Brave's binary and saw no link to libspeechd. That's expected. Chromium dlopens it at runtime instead of linking it at build time, which means it doesn't show up in `ldd` but is still required. `strings` confirmed the binary contains both `libspeechd.so.2` and `spd_open`. So the binary knows how to use libspeechd. It just needs to be able to find it.

On NixOS, "finding it" means it has to be in `LD_LIBRARY_PATH` because there's no global `/usr/lib`. Each binary's wrapper script explicitly enumerates what its child process can see. I dumped the wrapper:

```
LD_LIBRARY_PATH='/nix/store/...-libva-2.23.0/lib64'
```

That's the entire list. One entry, libva for video acceleration. No libspeechd. Then I checked the Firefox wrapper on the same machine:

```
LD_LIBRARY_PATH='/nix/store/...-speech-dispatcher-0.12.1/lib'
```

There it is. Firefox's nixpkgs wrapper includes speech-dispatcher explicitly. Brave's doesn't. That single difference is why Firefox spoke and Brave didn't.

This is a known nixpkgs bug, [#41074](https://github.com/NixOS/nixpkgs/issues/41074), "chromium: speechSynthesis does not work", **open since 2018**. The Firefox side was fixed in [#210453](https://github.com/NixOS/nixpkgs/pull/210453) and Chromium got a partial fix in [#133544](https://github.com/NixOS/nixpkgs/pull/133544), but Brave (which is repackaged from the upstream binary tarball, not built from source) never got the equivalent treatment.

I wrote an overlay that adds `speechd-minimal` to Brave's `buildInputs` and prepends its lib directory to the wrapper's `LD_LIBRARY_PATH`:

```nix
nixpkgs.overlays = [
  (final: prev: {
    brave = prev.brave.overrideAttrs (old: {
      buildInputs = (old.buildInputs or []) ++ [ final.speechd-minimal ];
      preFixup = (old.preFixup or "") + ''
        gappsWrapperArgs+=(
          --prefix LD_LIBRARY_PATH : ${final.lib.makeLibraryPath [ final.speechd-minimal ]}
        )
      '';
    });
  })
];
```

Rebuilt, killed every Brave process (closing the window isn't enough, Chromium-based browsers keep a zombie zygote alive for fast restart), relaunched. Confirmed via `cat /proc/$PID/environ` that the wrapper had speech-dispatcher in its `LD_LIBRARY_PATH`.

Still zero voices.

## Third patch: the flag Chromium hides behind

This was the most frustrating step because the diagnosis took longer than the fix.

I checked `/proc/$PID/maps` for the running Brave process to see what libraries were actually loaded. libspeechd was not there. That meant Brave wasn't even attempting the dlopen, let alone failing it. Something in Chromium's code was short-circuiting before it got that far.

`strings` on the Brave binary again, looking for any switch related to speech:

```bash
$ strings brave | grep -E "speech-dispatcher|speech-api"
disable-speech-api
disable-speech-synthesis-api
enable-speech-dispatcher
```

There it is. `enable-speech-dispatcher`. Chromium-based browsers gate the entire speechd code path behind that flag. No flag, no dlopen, no voices, no audio. Firefox doesn't have this gate, which is why Firefox just works.

So the overlay needed a second change: add `--enable-speech-dispatcher` to the default command-line args.

```nix
preFixup = (old.preFixup or "") + ''
  gappsWrapperArgs+=(
    --prefix LD_LIBRARY_PATH : ${final.lib.makeLibraryPath [ final.speechd-minimal ]}
    --add-flags "--enable-speech-dispatcher"
  )
'';
```

Rebuilt, killed Brave again, relaunched. Voices populated. App spoke. My toddler would be pleased.

## Then this showed up

A bright yellow infobar at the top of every Brave window: **"You are using an unsupported command-line flag: --enable-speech-dispatcher. Stability and security will suffer."**

That's a non-starter for a kid's app. The whole point is hand-her-the-laptop simple.

The warning bar comes from Chromium's `bad_flags_prompt.cc`, which keeps a hardcoded list of switches that Chromium considers risky. `--enable-speech-dispatcher` is on that list because the speechd code path isn't sandboxed the way Chromium's first-party media services are. libspeechd opens a Unix socket and the output modules dlopen further code from the user environment, which doesn't fit Chromium's "no library loading in the renderer" model. Firefox doesn't enforce that model so it can just enable speechd silently.

The clean fix is Chromium's managed-policy system. There's an official enterprise policy `CommandLineFlagSecurityWarningsEnabled` that suppresses exactly this infobar without the side effects of `--test-type` (which would also signal "automated testing" to sites and skip first-run UI). Brave reads policies from `/etc/brave/policies/managed/*.json`.

```nix
environment.etc."brave/policies/managed/disable-bad-flag-warnings.json".text =
  builtins.toJSON {
    CommandLineFlagSecurityWarningsEnabled = false;
  };
```

Restarted Brave. Visited `brave://policy/` to confirm the policy was loaded. Warning bar gone. TTS still working.

## What this actually costs you

Three things in this stack weaken Brave's security posture, and I want to be honest about each one before anyone copy-pastes this into their own config.

`--enable-speech-dispatcher` pulls libspeechd, the speech-dispatcher daemon, and the output modules (espeak-ng, pico, flite) into the attack surface of any web page that can reach `speechSynthesis`. These components are not sandboxed the way Chromium's first-party services are. A vulnerability in their text or SSML parsing becomes reachable from JavaScript. That's exactly why upstream Chromium flags it as risky and leaves it off by default.

`CommandLineFlagSecurityWarningsEnabled = false` removes the visual cue that the browser is running in a non-default security state. The flag suppression itself doesn't add risk, but it does mean that if a future maintainer (or a compromised launcher) slips in additional risky flags, you no longer have a banner that would tip you off.

Adding speech-dispatcher to `LD_LIBRARY_PATH` is negligible on its own, but it's a change worth knowing about.

The mitigating context: speech-dispatcher runs as the unprivileged user on a local Unix socket, and this is the same configuration most desktop Linux distros (Ubuntu, Fedora) ship by default. The incremental risk over a stock Linux desktop is small. The incremental risk over a stock NixOS install is real, because NixOS does not ship speechd by default and doesn't expect that code path to be reachable from the browser.

I'm applying this on single-user trusted machines. Don't apply it to multi-tenant hosts, public kiosks, or anything running untrusted code. The commit message and the comments in the overlay carry the same warnings.

## What I'd change upstream

The nixpkgs Brave package needs the same treatment Firefox got in #210453: add `speechd-minimal` to `runtimeDependencies` and inject the lib path into the wrapper. That fixes layer two for everyone without anyone having to write an overlay.

The Chromium flag is harder. Upstream Chromium is the gatekeeper, and they've made a deliberate security decision to leave speechd off by default. NixOS could ship the flag as a default for Brave/Chromium, but that would weaken the default posture, which is the wrong direction. I think the right answer is to make the local override pattern documented and easy, the way nixpkgs already documents `programs.firefox.policies`. Right now there's no `programs.brave.policies` module, so every user has to write the `environment.etc` block by hand.

The warning bar fix is fine to keep local. It's an opt-in policy by design.

## What I keep relearning

Each browser packager on Linux makes a different set of choices about which optional runtime dependencies are baked into the wrapper. Most users never hit those gaps because their distro pre-installs the dependencies into `/usr/lib` and the wrapper happens to look there. NixOS makes the gaps visible because nothing is in `/usr/lib`. The same browser binary that works out of the box on Ubuntu won't necessarily work on NixOS, and the failure mode is usually silent.

The other lesson is that "the binary supports it" doesn't mean "the binary will use it." `--enable-speech-dispatcher` cost me an hour of treating this as a library-loading problem when it was actually a feature-gate problem. `strings` saved me again. When something with a known feature isn't doing the thing, search the binary for switches related to that feature before you keep digging at the OS level.

The nixpkgs issue is going on seven years. I should probably go file a PR.
