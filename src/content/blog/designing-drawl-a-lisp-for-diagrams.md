---
title: "Designing drawl, a Lisp for diagrams"
date: "2026-05-08"
categories: ["engineering"]
tags: ["clojure", "clojurescript", "lisp", "dsl", "diagrams", "c4", "compilers", "babashka"]
excerpt: "How a throwaway s-expression sketch turned into a small Lisp for architecture diagrams, the design decisions along the way, and why a Clojure cljc core ended up being the right shape."
published: true
readingTime: "12 min read"
---

I keep ending up in the same loop with architecture diagrams. I sketch something on a whiteboard, decide it's worth keeping, and then have to choose between three bad options. Mermaid is fine until I want consistent styling across systems. Excalidraw is great for sketches but the source is opaque JSON. Graphviz dot is powerful but verbose, and the syntax is unpleasant to write by hand. None of them feel like they fit the way I actually think about systems, which is hierarchical containment with named references.

So I started sketching what a DSL would look like if it matched the shape of the problem. The shape that kept coming back was Lisp.

```lisp
(diagram
  (system
    (component A)
    (component B)))
```

Containment is nesting. Every node is a list. The diagram is the AST. The whole thing felt right immediately, in the way a design only feels right when it stops asking you to think about syntax.

I spent a few sessions with Claude as a thinking partner, working through the design until it was small enough to actually build. The result is [drawl](https://github.com/jordangarrison/drawl), a small Lisp for declaring architecture diagrams. It's pre-v0.1, but the core compiler is working and there's a live editor running at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev) if you want to try it.

This post is about the design conversation, not the code. The code is small. The decisions were the hard part.

## Why Lisp at all

The interesting thing about Lisp for a DSL like this isn't the parens. It's that the source is structured data. There's no parse step. The reader hands you a tree, and your job is to walk that tree and emit something. For a diagram tool, where the source IS a tree, this collapses an entire layer of the implementation.

The other lever is macros. A diagram language without macros is just S-expression flavored YAML. With macros, architectural patterns become first-class abstractions. You can define `defservice`, `def3-tier`, or `defaws-lambda` once and then your diagrams compose from those primitives. This is the actual reason to pick Lisp. Otherwise pick TypeScript and you're done.

I looked at the existing Lisp options before committing to building anything. They sit on a spectrum that has a real gap in the middle:

- Racket's [pict](https://docs.racket-lang.org/pict/) is the lowest level. Functional pictures, beautiful primitives, but you're drawing shapes and letters. Way too in the weeds for "I want a box that says API."
- [cl-dot](https://github.com/michaelw/cl-dot) is the right altitude. CLOS objects in, dot out. But the documentation is thin and it expects you to model your domain as Lisp objects first, which is a different kind of work than writing a diagram.
- [mingrammer/diagrams](https://github.com/mingrammer/diagrams) is the right ergonomic level, but it's Python and the abstraction is `Class()` and `>>`. Mature, well-styled cloud icon catalogs, but not Lisp.
- [Penrose](https://penrose.cs.cmu.edu/) is closest in spirit. The Domain / Substance / Style separation is genuinely the right architecture for a diagram language. Worth reading the paper. Not Lisp, and the surface is heavier than I want for "the boxes I draw on whiteboards."
- [Tangle](https://github.com/Macroz/tangle) for Clojure is the closest "use today" answer. Plain data, dot out, well-documented. But it's a library API, not a language. You're calling `graph->dot` with vectors of nodes and edges, not writing source.

The gap I wanted to fill was between cl-dot and mingrammer: a real Lisp DSL where you write source, and the source is the diagram, but you don't have to model anything as objects or call into an API. Just nest forms.

## Design decisions

The whole design pinned down in a handful of choices. Each one is a fork I had to take, and each one was decided by leaning toward "no special syntax" wherever possible.

**Containment is nesting.** A `system` form contains its children. A `container` contains its components. There's no `:children` keyword, no `parent-of` reference. You read the diagram top to bottom and the structure is the layout.

**Edges are forms.** I went back and forth on whether edges should be siblings of their endpoints or nested inside the source node. Sibling forms won. They're more macro-friendly, they let you generate edges from data, and they keep the model uniform. Every form is `(tag args... children...)`. Edges are just forms whose tag happens to be `->`.

```lisp
(system bank "Internet Banking System"
  (container web "Web App")
  (container api "API")
  (container db "Database")
  (-> web api "API calls")
  (-> api db "Reads/writes"))
```

**References are bare symbols.** When `(-> web api)` appears, `web` and `api` are looked up in a flat global namespace. Every `(component name ...)` registers `name` and collisions error out. This is the simplest thing that works, and 95% of diagrams fit. Qualified references like `bank/web` are reserved for future use if collisions ever start to bite, but they probably won't.

**Attributes are keyword value pairs.** I considered making everything a child form, in the spirit of "no privileged syntax." It would have been more homoiconic. But CL-style `:tech "Phoenix"` reads cleanly and Lispers parse it without thinking. The pragmatic call won.

```lisp
(container webapp "Web App" :tech "Phoenix")
(container db "Database" :role :database :tech "PostgreSQL")
(-> webapp db "queries" :tech "JDBC")
```

The parsing rule that keeps this unambiguous is single-pass with no backtracking: take positional arguments, then keyword/value pairs, then once you hit a non-keyword form you're in children-land for the rest. No interleaving. The whole walker is a multimethod that dispatches on the head symbol of each form.

**Levels are inferred.** Drawl is C4-aligned. A diagram with `system`s and nothing nested is a context diagram. Add `container`s and it becomes a container diagram. Add `component`s and it's a component diagram. You don't declare the level. The walker takes the deepest `:kind` it sees and that's the level. The same source can render at three zoom levels by filtering the IR, which is the architectural payoff of having an IR at all.

## C4, but not married to it

I wasn't trying to clone Structurizr. But the C4 vocabulary lined up with what I was already going to build, and adopting it gave me a forcing function for the type system. Person, system, container, component, and an `:external` flag for out-of-scope things. Edges have a description and an optional technology tag. That's it. It's a small enough surface that it falls out of the design rather than constraining it.

Here's the canonical "Internet Banking" example from the C4 site, written in drawl:

```lisp
(diagram "Internet Banking — Containers"
  (person customer "Banking Customer")

  (system bank "Internet Banking System"
    (container webapp "Web App")
    (container spa "SPA")
    (container api "API")
    (container db "Database")
    (-> spa api "API calls")
    (-> api db "Reads/writes"))

  (system mainframe "Mainframe Banking")

  (-> customer webapp "Visits bigbank.com")
  (-> webapp spa "Delivers SPA")
  (-> api mainframe "Calls"))
```

Compiled and rendered through graphviz:

![Internet Banking diagram, rendered from drawl source via graphviz dot](/blog-drawl-internet-banking.png)

The graphviz output is the v0.1 backend. Mermaid C4 is next, then Excalidraw. The walker and IR don't change; only the emitter does. Pure functions of `IR -> String`, dispatched by element kind. Adding a backend is mechanical.

## Picking a language to build it in

I started with a single-file React prototype: textarea, hand-rolled tokenizer, parser, walker, dot emitter, viz.js for rendering. It worked. The whole thing was about 400 lines of TypeScript. But the parser alone was 80 lines, and the moment I started thinking about macros I knew I was about to recreate a fraction of what a real Lisp gives you for free.

Then I went around the block on language choices. I considered Common Lisp (best macro system, but the browser story is rough), Racket (`#lang dml` would be the most "I designed a language" path, but RacketScript is incomplete and a server-side deploy reintroduces the backend I didn't want), Scheme (great hygienic macros, no real browser story), OCaml (exhaustive pattern matching is genuinely tempting, but you give up homoiconicity and the reader), and Rust (WASM is first-class, you get a CLI binary for free, but more code and slower iteration).

Each one is a defensible answer for a slightly different project. For mine, ClojureScript via a `.cljc` core won, and not by a small margin.

The reason is shape. A `.cljc` namespace runs on both JVM Clojure and ClojureScript. Reader conditionals handle the platform-specific seams (`clojure.edn/read-string` on the JVM, `cljs.reader/read-string` in the browser). Everything else is just data manipulation: walking forms, building an IR map, emitting strings. None of that cares which runtime it's on.

That gives me three targets from one codebase:

```
src/
  drawl/
    parser.cljc        ; reader conditional for read-string
    walker.cljc        ; pure data transformation
    ir.cljc            ; pure
    emit/
      dot.cljc         ; pure string building
  app/
    core.cljs          ; UIx mount, browser-only
    editor.cljs        ; CodeMirror wrapper
  cli/
    main.clj           ; bb entry point
```

A browser SPA via shadow-cljs. A Babashka CLI for piping into shells and editors. A JVM library if anyone wants to call the compiler from a Clojure program. All from one source tree, with the same code paths for parsing, walking, and emitting. The browser and the CLI aren't two implementations of the same thing. They're the same implementation with different I/O.

The whole compile pipeline ends up being shorter than the JS prototype's parser alone:

```clojure
(defn compile [source backend]
  (let [forms (parser/parse-forms source)
        ctx  {:macros (collect-macros forms)}]
    (-> (the-diagram forms)
        (walker/walk-form ctx)
        ir/with-level
        ir/validate
        (emit backend))))
```

The walker is multimethod dispatch on form head. Adding a new element kind is a `defmethod`. Adding a built-in shorthand like `webapp` or `postgres-db` is also a `defmethod`. User macros register into a per-compile registry and the `:default` method falls through to expansion. There's no separate macro pass and no separate parser. The dispatch table IS the language.

## What about runtime user macros

This is the one place I made a deliberate concession. ClojureScript macros run at compile time, on the JVM. If you want users to define macros in their own diagram source and have them work in the same buffer, you need self-hosted ClojureScript via `cljs.js`. That ships the compiler in the bundle, which is real cost.

I went with a smaller answer: drawl has its own template macro system that does plain symbol substitution at walk time. No `eval`, no quoting gymnastics. It's not Clojure macros, but it's enough for the common case:

```lisp
(defmacro service [id label tech]
  (container id label :tech tech))

(defmacro tier [id label & children]
  (system id label & children))

(diagram "Hello"
  (service api "API" "Phoenix")
  (tier infra "Infra"
    (postgres-db db "Main DB")))
```

User macros override built-ins of the same name with a warning, last-write-wins, the way Lisp expects. The expansion is lexical, not eval'd, so you can't do anything truly creative. But you can absolutely abstract over your conventions, which is the actual user need.

If real Clojure-grade macros become a demand, swapping in self-hosted CLJS is additive. Same parser, same walker, same emitters. You just insert `cljs.js/eval` before the walker. Not v0.1 work.

## Naming

I went around on the name embarrassingly long. I started with "dml" because it was three letters and obvious. The list of alternatives I considered ran from forme (typographic and editorial, my first second-favorite) to limn to plat to bough. All of them were too literary for what is actually a casual developer tool. The reference points were Excalidraw, draw.io, eraser.io. Short, common words, slightly playful, with the drawing object somewhere in the name.

Drawl landed because it does double duty. The L of "draw" merges with the L of "Lisp," there's a faint pun on Lisp's original meaning as a speech impediment, and "drawl" as a real word evokes slow and deliberate speech, which is roughly the experience of writing a diagram in s-expressions. It's a casual name with a wink for the people who get the wink.

The optional backronym is **Diagrams Rendered As Walked Lists**, which is technically accurate. The walker walks lists. That's literally what it does. I treat the backronym as flavor rather than identity. Drawl is the name. The expansion is a footer joke for people who'd appreciate it.

## Where it stands

The compiler is working end to end. Parser, walker, IR, dot emitter, level inference, at-level filtering, nesting validation, ref and duplicate-id checks. The browser SPA at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev) has a CodeMirror 6 editor wired to nextjournal's clojure-mode (paren matching, slurp/barf, auto-close, syntax highlight) and re-renders on every keystroke through viz.js. Press Ctrl+/ in the editor for a cheatsheet covering both keyboard shortcuts and drawl syntax.

What's missing from v0.1: a Mermaid C4 emitter, the Babashka CLI as a packaged distribution, and an Excalidraw backend. The Mermaid emitter is the next thing I'm picking up. The CLI follows the spec already; it just needs `bbin` packaging. Excalidraw is the most interesting one because Excalidraw's JSON format is awkward for programmatic generation, but if it works, you get hand-drawn-looking diagrams from a Lisp source. That's a vibe I'd very much like to have.

The whole drawl source tree is about 555 lines of Clojure right now. The browser app, the editor wrapper, the parser, the walker, the IR, the macro engine, and the dot emitter. That's small enough that I can keep the whole thing in my head while I'm working on it, which is a property I want to preserve.

## What I learned designing this

A few things stuck with me from the design process.

**Use the host language's reader.** The single biggest ergonomic win of going to Lisp was deleting my parser. Eighty lines of tokenizer-and-parser turned into one call to `read-string`. That's not a small saving. It's a category change in how the compiler is organized.

**Constrain the surface ruthlessly in v0.1.** I left a lot on the floor. No `<->` styling per direction, no nested attribute maps, no qualified references, no inline images, no theme overrides. Every one of these is a real feature that real users will want. None of them are needed to validate that the design works. The job of v0.1 is to prove the shape is right, not to be complete.

**Pick the language that maximizes the property you care about.** I cared about iteration speed on the DSL itself, deletability of the parser, and being able to ship the same compiler to a browser, a CLI, and the JVM. CLJS via `.cljc` was the only option that gave me all three. OCaml and Rust give you better types; Common Lisp gives you better macros; Racket gives you `#lang`. None of them give you the "same code, three runtimes" shape with the same effort.

**Build the prototype before you commit to the language.** The throwaway TypeScript prototype was the most useful thing I did. It told me the design was right before I'd invested in any of the language tradeoffs. By the time I switched to ClojureScript, I knew exactly what I was building, which made the port a translation rather than a redesign.

If you want to play with it, [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev) is the editor. The source and design docs are at [github.com/jordangarrison/drawl](https://github.com/jordangarrison/drawl); `GRAMMAR.org` is the canonical reference for the language and `SPEC.org` is the longer design document. Issues and ideas welcome.
