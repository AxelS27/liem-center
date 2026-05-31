---
name: shadcn-ui
description: Use when building or restyling any apps/web UI - landing pages, app screens, adding or customizing shadcn/ui components, or editing theme tokens. Enforces the customization discipline that keeps the result from looking generic-AI: opinionated palette first, every shadcn component retuned off its defaults, and a self-review of the rendered page against docs/FRONTEND.md at real viewports. Read before touching apps/web or packages/ui visuals.
---

# shadcn/ui customization discipline

shadcn/ui is the component layer for this repo and it is **already wired** (ADR-003, ADR-014). This skill is not "how to add a component" - it is how to stop the UI from looking like a generic AI demo. The library is a skeleton; the look is what you do to it. Untouched shadcn defaults are the single most common AI tell.

This file is the **procedure**. `docs/FRONTEND.md` is the full **spec** - open it. This does not repeat its forbidden-patterns list.

## Step 0 - Do not rebuild the plumbing

The deterministic setup already exists. Do not re-run `shadcn init`, do not regenerate these, do not "accept defaults":

- `apps/web/components.json` - shadcn writes components into `@repo/ui` (packages/ui).
- `apps/web/tailwind.config.ts` - maps the `globals.css` tokens to Tailwind + the house type scale; `darkMode: 'class'`.
- `apps/web/src/styles/globals.css` - the **one** source of color. Semantic tokens only.
- `packages/ui/src/lib/cn.ts` - the `cn()` helper.
- `packages/ui/src/components/ui/button.tsx` - the **reference primitive**. Match its house style.

## Step 1 - Palette and identity first (before any screen)

The highest-leverage anti-generic move. Do it before building UI. First, skim `docs/REFERENCES.md`, find the closest vertical, and study one or two of those real products - they beat AI-landing-page patterns as a starting point.

1. Commit to a real palette for _this_ product. **No default violet/indigo, no glassmorphism/glow.** Pick a deliberate brand hue and neutrals with a slight temperature; check contrast.
2. Replace the neutral placeholder values in `:root` in `globals.css` (`--brand`, `--primary`, `--background`, `--muted`, ...). Shipping the placeholder neutral _is_ shipping the AI look.
3. Set one type family via `--font-sans` (next/font in the root layout). One or two families total, no decorative serif-italic.
4. Tune `--radius` once to a deliberate value; the whole UI follows.

Retheming is this file only. If you are setting color anywhere else, you are doing it wrong.

## Step 2 - Add components, then RETUNE

```
pnpm dlx shadcn@latest add <component>
```

It lands in `packages/ui` via `components.json`. **Never ship it as emitted.** Retune it to match `button.tsx`: radius, font weight, density and padding, token colors, a real `focus-visible` ring. A component that still reads as "default new-york" is not done.

Guardrails lint enforces automatically (a green build blocks them):

- No `min-h-screen` / `h-screen` / `100vh` to fill a section.
- No raw palette classes (`bg-zinc-*`, `text-gray-*`, violet/indigo, ...). Tokens only.
- No hardcoded hex in `className` (`bg-[#...]`).

Everything else in `docs/FRONTEND.md` is on you - lint cannot see layout.

## Step 3 - Compose with structure

Two tests, on every screen:

- If it could be any AI demo, it is not done.
- If an element exists only to look "cool", delete it.

Mock the layout first - rough markup in one file, no data wiring - until the structure feels right; don't let a database schema lock the design before you have seen it.

Build hierarchy from spacing, type scale, and weight before reaching for cards or borders, and disclose progressively (secondary actions in menus, not all surfaced inline). Use asymmetry and real content density, not centered-everything stacks. Honor the App Structure rules in `docs/FRONTEND.md`: a real landing page (not a login wall), navbar + footer on public pages, anchor nav with an active state, one shared page scaffold. Ship one theme and one language (English) first. Keep `docs/PROGRESS.md` current as you build - what lives on each page, what connects to what, what is done - so a long build stays consistent.

## Step 4 - Render and self-review before you finish

Reading `docs/FRONTEND.md` is not applying it. **Before you consider any apps/web UI finished, run the app and self-review it against the checks in `docs/FRONTEND.md`,** then fix anything that misses.

- Review the **actually rendered viewports**, not the code: mobile plus **1366x768, 1440x900, 1920x1080**. Scroll through every section transition.
- If you cannot render the app locally, say so explicitly rather than assuming the page is fine. Do not guess.

`pnpm lint && pnpm typecheck` passing does not cover a single layout check. Looking at the rendered page is the point: it turns the spec from something you read into something you applied.
