---
title: "Designing drawl, a Lisp for diagrams"
date: "2026-05-08"
categories: ["engineering"]
tags: ["clojure", "clojurescript", "lisp", "dsl", "diagrams", "c4", "compilers", "babashka"]
excerpt: "How a throwaway s-expression sketch turned into a small Lisp for architecture diagrams, the design conversation that pinned the shape down, and why a Clojure cljc core ended up being the right way to ship it."
published: true
readingTime: "11 min read"
---

> **TL;DR.** drawl is a small Lisp for declaring architecture diagrams. You write nested s-expressions, the compiler walks them into an IR, and an emitter spits out graphviz dot (with mermaid C4 and Excalidraw backends planned). Try the live editor at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev), source at [github.com/jordangarrison/drawl](https://github.com/jordangarrison/drawl). The rest of this post is the design conversation behind it.

I keep ending up in the same loop with architecture diagrams. I sketch something on a whiteboard, decide it's worth keeping, and then have to choose between three bad options. Mermaid is fine until I want consistent styling across systems. Excalidraw is great for sketches but the source is opaque JSON. Graphviz dot is powerful but the syntax is unpleasant to write by hand. None of them match how I actually think about systems, which is hierarchical containment with named references.

So I started sketching what the source should look like if it matched the shape of the problem. The sketch that kept coming back was Lisp.

```lisp
(diagram
  (system
    (component A)
    (component B)))
```

Containment is nesting. Every node is a list. The diagram is the AST. I sat with that for a while and couldn't find anything wrong with it.

A few sessions of design conversation with Claude later, I had a small enough spec to actually build. The result is [drawl](https://github.com/jordangarrison/drawl), a Lisp for declaring architecture diagrams. It's pre-v0.1, but the core compiler is working and there's a live editor at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev) if you want to try it.

## Why Lisp

The reason isn't the parens. It's that the source is structured data. There's no parse step. The reader hands you a tree, and your job is to walk that tree and emit something. For a tool whose source IS a tree, that collapses an entire layer of the implementation.

The other lever is macros. Without them, a diagram language in s-expressions is just s-expression flavored YAML. With them, architectural patterns become first-class abstractions. Define `webapp`, `postgres-db`, or `def3-tier` once and your diagrams compose from those primitives. That's the actual reason to pick Lisp. Otherwise pick TypeScript and you're done.

I went looking at what already existed before committing to building anything. There's a real gap in the middle of the Lisp ecosystem here:

- Racket's [pict](https://docs.racket-lang.org/pict/) is the lowest level. Functional pictures, beautiful primitives, but you're drawing shapes and letters. Way too in the weeds for "I want a box that says API."
- [cl-dot](https://github.com/michaelw/cl-dot) is the right altitude. CLOS objects in, dot out. The documentation is thin and it expects you to model your domain as Lisp objects first, which is a different kind of work than writing a diagram.
- [mingrammer/diagrams](https://github.com/mingrammer/diagrams) is the right ergonomic level, but it's Python. The abstraction is `EC2()` and `>>`. Mature, well-styled cloud icon catalogs. Not Lisp.
- [Penrose](https://penrose.cs.cmu.edu/) is closest in spirit. The Domain / Substance / Style separation is genuinely the right architecture for a diagram language. Worth reading the paper. Not Lisp, and the surface is heavier than I want for "the boxes I draw on whiteboards."
- [Tangle](https://github.com/Macroz/tangle) for Clojure is the closest "use today" answer. Plain data, dot out, well-documented. But it's a library API, not a language. You call `graph->dot` with vectors of nodes and edges. You don't write source.

The gap I wanted to fill was between cl-dot and mingrammer: a real Lisp DSL where you write source, the source IS the diagram, and you don't have to model anything as objects or call into an API. Just nest forms.

## The design conversation

The whole language came down to a handful of forks. Each one was decided by leaning toward "no special syntax."

Containment is nesting. A `system` form contains its children. A `container` contains its components. There's no `:children` keyword, no `parent-of` reference. You read the diagram top to bottom and the structure is the layout.

Edges I went back and forth on. Should they be siblings of their endpoints, or nested inside the source node? Sibling forms won. They're more macro-friendly, and they keep the model uniform. Every form is `(tag args... children...)`. Edges are just forms whose tag happens to be `->`.

```lisp
(system bank "Internet Banking System"
  (container web "Web App")
  (container api "API")
  (container db "Database")
  (-> web api "API calls")
  (-> api db "Reads/writes"))
```

References are bare symbols. When `(-> web api)` appears, `web` and `api` are looked up in a flat global namespace. Every `(component name ...)` registers `name` and collisions are a hard error. Simplest thing that works, and 95% of diagrams fit. Qualified references like `bank/web` are reserved if collisions ever start to bite, but they probably won't.

Attributes were the only place I broke the "no special syntax" rule. I considered making everything a child form, in the spirit of staying homoiconic. But CL-style `:tech "Phoenix"` reads cleanly and Lispers parse it without thinking, so the pragmatic call won.

```lisp
(container webapp "Web App" :tech "Phoenix")
(container db "Database" :role :database :tech "PostgreSQL")
(-> webapp db "queries" :tech "JDBC")
```

The parsing rule is single-pass with no backtracking: positional arguments first, then keyword/value pairs, then once you hit a non-keyword form you're in children-land for the rest. No interleaving. The walker is a multimethod that dispatches on the head symbol of each form.

Levels are inferred. Drawl is C4-aligned, but you don't declare which C4 level a diagram is at. The walker takes the deepest `:kind` it sees and that's the level. A diagram with only `system`s is a context diagram. Add `container`s and it's a container diagram. Add `component`s and it's a component diagram. The same source can render at three zoom levels by filtering the IR, which is the architectural payoff of having an IR at all.

## C4, lightly

I wasn't trying to clone Structurizr. But the C4 vocabulary lined up with what I was already going to build, and adopting it gave me the whole element type system for free: person, system, container, component, plus an `:external` flag for out-of-scope things. Edges have a description and an optional technology tag. That's the entire surface.

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

Graphviz dot is the v0.1 backend. Mermaid C4 is next, then Excalidraw. The walker and IR don't change when I add a backend; only the emitter does. They're pure functions of `IR -> String`.

## Picking a language to actually build it in

I started with a single-file React prototype: textarea, hand-rolled tokenizer, parser, walker, dot emitter, viz.js for rendering. It worked. About 400 lines of TypeScript. But the parser alone was 80 of those lines, and the moment I started thinking about macros I knew I was going to recreate a fraction of what a real Lisp gives you for free.

So I went around the block on language choices. Common Lisp has the best macro system but the browser story is rough (CLOG works but means a backend, JSCL is partial). Racket has `#lang dml`, which would be the most "I designed a language" path, but RacketScript is incomplete and any server-side deploy reintroduces the backend I didn't want. Scheme has great hygienic macros and no real browser story. OCaml's exhaustive pattern matching is genuinely tempting until you remember you give up homoiconicity and the reader. Rust has first-class WASM and you get a CLI binary for free, but it's more code and a slower iteration loop on a DSL that's still moving.

ClojureScript via a `.cljc` core won, mostly because of one structural thing: a `.cljc` namespace runs on both JVM Clojure and ClojureScript. Reader conditionals handle the platform-specific seams (`clojure.edn/read-string` on the JVM, `cljs.reader/read-string` in the browser). Everything else is just data manipulation. None of it cares what runtime it's on.

That gives me three targets from one source tree:

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

A browser SPA via shadow-cljs. A Babashka CLI for piping into shells and editors. A JVM library if anyone wants to call the compiler from a Clojure program. Same code paths for parsing, walking, and emitting; the only thing that changes between targets is the I/O.

The whole compile pipeline ends up shorter than the JS prototype's parser alone:

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

The walker is multimethod dispatch on form head. Adding a new element kind is a `defmethod`. Adding a built-in shorthand like `webapp` or `postgres-db` is also a `defmethod`. User macros register into a per-compile registry and the `:default` method falls through to expansion. There's no separate macro pass, no separate parser, and no separate symbol table.

## What about runtime user macros

This is the one place I deliberately punted. ClojureScript macros run at compile time, on the JVM. If you want users to define macros in their own diagram source and have them work in the same buffer, you need self-hosted ClojureScript via `cljs.js`, which ships the compiler in the bundle. That's about a megabyte of cost.

Drawl has its own template macro system instead: plain symbol substitution at walk time. No `eval`, no quoting gymnastics. It's not Clojure macros, but it covers the case people actually want, which is abstracting over conventions:

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

User macros override built-ins of the same name with a warning. Last-write-wins, the way Lisp expects. The expansion is lexical, not eval'd, so you can't do anything truly creative with it. If real Clojure-grade macros become a demand later, swapping in self-hosted CLJS is additive: same parser, same walker, same emitters, with `cljs.js/eval` inserted before the walker. Not v0.1 work.

## Naming

I went around on the name embarrassingly long. Started with "dml" because it was three letters and obvious. Considered forme, limn, plat, bough. All too literary for what is actually a casual developer tool. The reference points were Excalidraw, draw.io, eraser.io: short, common words, slightly playful, with the drawing object somewhere in the name.

Drawl landed because of the way the L of "draw" merges with the L of "Lisp," plus the wink at Lisp's original meaning as a speech impediment, plus "drawl" as a real word evokes slow and deliberate speech, which is roughly what writing diagrams in s-expressions feels like.

If you squint there's a backronym in there: **Diagrams Rendered As Walked Lists**. The walker walks lists. Technically accurate, mostly a footer joke.

## Where it stands

The compiler is working end to end. Parser, walker, IR, dot emitter, level inference, at-level filtering, nesting validation, ref and duplicate-id checks. The browser SPA at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev) has a CodeMirror 6 editor wired to nextjournal's clojure-mode (paren matching, slurp/barf, auto-close, syntax highlight) and re-renders on every keystroke through viz.js. Press Ctrl+/ for a cheatsheet covering both keyboard shortcuts and drawl syntax.

What's missing from v0.1: a Mermaid C4 emitter, the Babashka CLI as a packaged distribution, an Excalidraw backend. Mermaid is what I'm picking up next. The CLI follows the spec already and just needs `bbin` packaging. Excalidraw is the most interesting one because Excalidraw's JSON format is awkward for programmatic generation, but if it works you get hand-drawn-looking diagrams from a Lisp source. That's a vibe I'd very much like to have.

The whole drawl source tree is about 555 lines of Clojure right now: browser app, editor wrapper, parser, walker, IR, macro engine, dot emitter. Small enough that I can keep the whole thing in my head, which is a property I want to preserve.

## A few things I'd say to past-me

The single biggest ergonomic win of going to Lisp was deleting my parser. Eighty lines of tokenizer-and-parser turned into one call to `read-string`. Not a small saving. It changed how the rest of the compiler is organized, because every downstream stage gets to assume it's working on real data structures instead of a hand-rolled AST.

The throwaway TypeScript prototype was the second-best thing I did. It told me the design was right before I'd invested in any of the language tradeoffs. By the time I switched to ClojureScript I knew exactly what I was building, and the port was a translation rather than a redesign.

And keeping v0.1 small is the only reason it's actually built. There's no `<->` styling per direction, no nested attribute maps, no qualified references, no inline images, no theme overrides. Every one of those is a real feature someone will want. None of them are needed to validate that the design is right.

Try it at [drawl.jordangarrison.dev](https://drawl.jordangarrison.dev). Source and design docs at [github.com/jordangarrison/drawl](https://github.com/jordangarrison/drawl); `GRAMMAR.org` is the canonical reference for the language, `SPEC.org` is the longer design doc. Issues and ideas welcome.
