# Skill: UI Audit

**Trigger:** User says "audit the UI", "review the frontend", "check if this looks AI-generic", or similar.

**What this skill does:** Runs a structured multi-axis audit of apps/web UI work against the rules in docs/engineering/FRONTEND.md. The goal is to catch AI-generic output, missing component states, animation violations, and accessibility gaps before they ship.

**Stack context:** Next.js App Router · Tailwind CSS · CSS custom property tokens in globals.css · shadcn/ui primitives in packages/ui · lucide-react icons.

---

## How to Run This Audit

For each axis below, inspect the code — read the relevant files and run the greps. Do not render the page or take screenshots. Mark each item PASS, FAIL, or N/A. For every FAIL, state the exact issue and the fix.

Do not mark everything PASS without evidence. The audit is only useful if it catches real problems.

---

## Axis 1 — AI-Generic Detection

The most important axis. A page that looks like it could be any AI demo is not done.

```
□ PALETTE: Does every color come from a token in globals.css?
    FAIL if: raw hex in className, raw Tailwind palette class (bg-zinc-900, text-blue-500),
             or if the overall palette reads as a default AI rotation
             (violet/indigo gradient, forest+cream, muted sage, dark-purple SaaS,
              teal-on-near-black, flat beige minimalism, or whatever is currently trendy).
    CHECK: grep for /text-(red|blue|green|yellow|gray|slate|zinc|violet|indigo|emerald|teal)-\d+/
           and /#[0-9a-fA-F]{3,6}/ in apps/web/src (excluding globals.css).

□ TYPEFACE: Is a deliberate modern typeface wired via next/font?
    FAIL if: no next/font import in layout.tsx, or if --font-sans is unset
             (text falls back to browser serif/system stack).

□ LAYOUT: Does the page have a real product identity, or does it look like the starter?
    FAIL if: the section order, copy, colors, or layout all match the starter wiring example.
             The starter is a reference, not a template to clone.

□ FONT WEIGHTS: Max 3 weights (400, 500/600, 700)?
    FAIL if: more than 3 weights appear on any screen.

□ SPACING: All values on the 4px grid?
    FAIL if: arbitrary values like p-[10px], gap-[14px], mt-[22px] appear in components.

□ GRADIENTS: No decorative background gradients?
    FAIL if: gradient classes on backgrounds, cards, or buttons (decorative use).
             Gradients allowed only in illustrations or intentional brand moments.

□ LOREM IPSUM / PLACEHOLDER COPY: No fake text?
    FAIL if: "Lorem ipsum", "Product 1", "User Name", "Feature Title" in any rendered UI.
```

---

## Axis 2 — Visual Hierarchy

```
□ PRIMARY ELEMENT: Is there ONE element that is clearly the most important on screen?
    → It should be the largest, boldest, or most contrasted element.
    → If two elements compete: one must yield.

□ READING ORDER: Does the eye naturally flow from most to least important?
    → Test: cover the screen, reveal 20% at a time. Does each reveal make sense?

□ WHITESPACE: Is whitespace used to group and separate — not uniformly?
    → Related items: 8–16px gap
    → Unrelated sections: 48–64px gap
    → If everything has the same spacing: FAIL.

□ CONTRAST HIERARCHY: Do text levels have distinct visual weights?
    → text-foreground: headings, key values — highest contrast
    → text-muted-foreground: labels, descriptions — medium contrast
    → subdued/helper text: lowest contrast
    → If all text looks the same weight: FAIL.

□ CARD SOUP: Are cards/panels used only where they earn their place?
    → FAIL if: shell, nav, filter bars, tables, forms, and metrics are all
               separately bordered cards. At least some hierarchy must come from
               spacing, alignment, type, bands, or open lists.

□ PAPER PROTOTYPE: Does the page feel more than a wireframe?
    → FAIL if: pale bordered rectangles dominate, imagery is faded,
               controls are quiet/invisible, large empty bands carry the design.
```

---

## Axis 3 — Component State Completeness

For every interactive component in scope, verify each applicable state exists:

```
□ DEFAULT: How it looks at rest. Clean, matches product tokens.
□ HOVER: Visible color/shadow/border shift within 150ms.
□ FOCUS: 2px accent ring + 2px offset via :focus-visible.
         Never outline: none without a replacement.
□ ACTIVE/PRESSED: scale(0.98) + background darkens within 80ms.
□ LOADING: Spinner replaces text; width locked to prevent layout shift;
           aria-busy="true" on the element.
□ DISABLED: 50% opacity; cursor not-allowed; no hover response.
□ ERROR: Red border + error message below field; role="alert"; shake on submit.
□ EMPTY: Icon + title + description + CTA. Never blank space or "No data".

FAIL if any applicable state is missing or indistinguishable from default.
```

---

## Axis 4 — Animation & Motion Quality

```
□ GPU-ONLY: Only transform and opacity are animated.
    FAIL if: transitions on width, height, top, left, margin, or padding.
    CHECK: grep for 'transition.*width\|transition.*height\|transition.*top' in component files.

□ DURATION: All animations ≤ 800ms. Durations match the timing scale:
    80ms (micro feedback) / 150ms (hover) / 250ms (standard) / 400ms (modal) / 600ms (complex).
    FAIL if: duration-[900ms], duration-[1000ms], or any value > 800ms.

□ REDUCED MOTION: prefers-reduced-motion rule exists in globals.css.
    FAIL if: the rule is missing or any component hardcodes an animation with no gate.

□ NO LOOPING on static content.
    FAIL if: animated elements loop when they are not in a loading state.

□ NO COMPETING ANIMATIONS: At most one major animation per viewport area at a time.

□ SCROLL ANIMATIONS: Use IntersectionObserver, not scroll event listeners.
```

---

## Axis 5 — Navigation & Route Connectivity

```
□ STICKY NAV: Primary navbar is sticky (sticky top-0) with a visible surface treatment.
    FAIL if: nav scrolls away, or nav text floats directly on the page background.

□ ACTIVE STATE: Active nav link has aria-current="page" and a visible style.
    FAIL if: no visual difference between active and inactive links on desktop or mobile.

□ ROUTE GRAPH: All primary nav links go to real pages (not same-page anchors).
    FAIL if: any primary nav item scrolls the page instead of navigating.

□ CROSS-LINKS: Public, auth, and app contexts are connected.
    FAIL if: the app has no path back to the public home, or auth has no link to sign in / sign up.

□ FOOTER: Every route has a footer or endcap with visible treatment (border-t, brand, links, copyright).
    FAIL if: footer is omitted, or is just two faint muted text lines with no structure.

□ FIRST VIEWPORT: On landing/home page, hero headline + supporting copy + CTA are visible
    without scrolling at ~720-768px desktop height.
    FAIL if: navbar eats the fold, or oversized padding pushes hero below visible area.
```

---

## Axis 6 — Accessibility

```
□ Images have alt text (empty string "" for purely decorative images).
□ Form inputs have associated <label> elements (htmlFor).
□ Color is never the only differentiator — always paired with text or icon.
□ Touch targets ≥ 44×44px on mobile.
□ Focus rings visible on Tab key (never suppressed without replacement).
□ Icon-only buttons have accessible aria-label.
□ Dynamic content changes announced via aria-live (toasts, status).
□ Modals trap focus; close on Escape.
□ No user-scalable=no in viewport meta.
```

---

## Axis 7 — Code-Based Evidence (no rendering)

The audit is code-based. Do not render the page or take screenshots — read the markup and
run the greps. This is intentional: rendering burns tokens and the preview often isn't
available.

```
□ I ran the Part A greps from docs/engineering/DESIGN_DNA.md and pasted the output:
    □ overflow-x-hidden on sticky ancestors → none
    □ backdrop-blur element uses a transparent bg (/80), not /95 or solid
    □ no raw hex or raw palette classes
    □ no bg-foreground on a large hero panel
    □ --background token still white/neutral
    □ no off-grid spacing

□ I read app/page.tsx, app/layout.tsx, and the site header and reasoned about:
    □ Section structure: open bands vs card soup
    □ Hero is the single focal point; no heavy sibling competing
    □ Sticky header has no overflow ancestor (will actually pin)
    □ Section transitions: no hard divider band with large blank padding between sections
    □ Footer endcap present with real structure

□ I checked short routes' markup (auth, empty state, 404):
    □ Enough content/structure that the footer is not exposed by a sparse panel

□ pnpm lint and pnpm typecheck pass (necessary but not sufficient — they do not catch layout issues)
```

Rendering is only a last-resort tie-breaker for exact visual balance, never a required step.

---

## Audit Output Format

Report each axis with:

```
AXIS 1 — AI-Generic Detection
  PASS: palette all tokens, typeface wired
  FAIL: spacing has p-[10px] in ProductCard.tsx line 42 → fix: use p-3 (12px)
  FAIL: text-blue-500 in hero section → fix: replace with text-primary

AXIS 2 — Visual Hierarchy
  PASS: clear primary element, reading order correct
  FAIL: whitespace is uniform 24px between all sections → hero and features need 64px gap

...

SUMMARY: X passes, Y failures. Blocking: [list blocking items]. Non-blocking: [list].
```

A failure is blocking if it makes the page look AI-generic, breaks an Iron Law, or violates an accessibility rule. Everything else is non-blocking but must be tracked.
