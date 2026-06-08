# Design DNA

> Read this before any UI work. Short on purpose.
> Detailed rules → `docs/engineering/FRONTEND.md`. Product-specific direction → `docs/product/UI_UX.md`.

**Build on the default starter — do not start from scratch.**

The existing code in `apps/web/` is the foundation. Extend and adapt it; do not replace it
with a fresh generation. The layout structure, section rhythm, component patterns, token
wiring, and nav/footer shell are already correct — they are the starting point, not a
reference to look at and then ignore.

What you change per product:

- `globals.css` — swap the accent/brand color. Keep background white.
- `app/page.tsx` — replace content, sections, and copy to fit the product. Keep the
  open-band composition unless `docs/product/UI_UX.md` explicitly calls for a different layout.
- `components/shared/site-header.tsx` — update nav links and logo to match the product.
- `components/shared/site-footer.tsx` — update links and brand name.

What you do not change without a clear reason from `docs/product/UI_UX.md`:

- The white background and neutral surface tokens
- The sticky nav with surface treatment
- The open-band section pattern (hero, features, CTA band, footer)
- The `next/font` + `--font-sans` wiring
- The footer structure

If it could be from any AI demo site, it is not done.

---

## Palette

- All color from tokens in `globals.css` — never raw hex, never raw Tailwind palette classes
- **Background stays white.** `--background` must stay near-white and neutral — `0 0% 100%`
  or a very slight cool/neutral tint. Never warm, never cream, never beige. The clean white
  surface is the foundation of the starter's feel; warming it is the #1 way to break it.
- **What you change = the accent/brand color** (`--primary`, `--brand`, `--ring`). Surfaces,
  backgrounds, borders, and muted tones stay in the neutral white/gray family.
- **Forbidden feels** (current AI rotation — not a complete blocklist):
  - warm cream / beige background (`--background` with any warmth)
  - violet / indigo gradient
  - warm orange + cream
  - forest green + cream editorial
  - muted sage
  - dark-purple "SaaS" gradient
  - teal on near-black
- One accent color. Semantic colors (success, warning, destructive) are separate from brand

## Typeface

- Wire a modern sans via `next/font` → `--font-sans` → `font-sans` in Tailwind
- Leaving it unset = browser serif fallback = instant AI tell
- Max 3 weights: **400** (body) · **500 or 600** (medium) · **700** (bold)
- Hierarchy from size and weight, not decorative font switches

## Composition — the most violated rule

The starter uses **open sections as the default**. Cards earn their place.

| Context                                                | Use                                   |
| ------------------------------------------------------ | ------------------------------------- |
| Hero, marketing sections, feature grids, promo bands   | Open bands — no card wrapper          |
| Product listings, data panels, dialogs, repeated items | Cards are appropriate                 |
| Stats / KPI strips on public pages                     | Only if they help the user's decision |

**Hard stops:**

- Hero content must not be wrapped in a card or panel
- Every section boxed in `bg-card border border-border rounded-lg` = card soup = fail
- Pale bordered rectangles are not a design system

## Focal point & surface weight

- **One focal point per screen.** The hero headline + primary action is the focal point of
  the first viewport. Nothing else in that viewport should compete with it for attention.
- **Heavy/dark/inverted surfaces are for intentional late-page moments** — a closing CTA
  band, the footer. Do **not** drop a large `bg-foreground` (near-black) or other heavy
  inverted panel in the hero/first viewport: it becomes a second focal point and steals the
  eye from the headline. The starter keeps the first viewport light and lets the headline win.
- **In a split/two-column hero, the side panel must be lighter than the headline column**,
  not heavier. A promo panel beside the hero is fine (Tokopedia does it) — but use a soft
  surface (`bg-secondary`, `bg-muted`, a subtle border), not a solid near-black block.

## Navigation

- `sticky top-0` with visible surface: `bg-background/80 border-b border-border backdrop-blur`
- Route-aware active state + `aria-current="page"` on every nav
- Mobile and desktop nav must show the same active link
- **Never put `overflow-x-hidden` on a sticky header's ancestor** (the layout shell, body,
  or any wrapper). `overflow-x: hidden` forces `overflow-y: auto`, turning that element into
  a scroll container and silently killing `position: sticky`. To kill horizontal scroll, use
  `overflow-x-clip` instead — it clips without creating a scroll container, so sticky still
  works. Better: find and constrain the element that actually overflows.
- For the backdrop blur to be visible, the header background must be partly transparent
  (`bg-background/80`), not near-opaque (`/95`). Blur on a solid fill shows nothing.

## First viewport

- Hero headline + copy + CTA visible without scrolling at ~720px desktop height
- Navbar must not push hero below the fold
- Achieve by restraining padding — not by forcing `min-h-screen` (lint blocks it)

## Footer

- `border-t border-border` + brand + link columns + copyright line
- Not two faint lines of muted text floating at the bottom of the page

## Spacing

4px grid only — valid: `4 8 12 16 20 24 32 40 48 64 80 96px`
Arbitrary values like `p-[10px]` `gap-[14px]` `mt-[22px]` are violations.

## Interactions

- Every interactive element needs: hover (150ms) · focus ring (2px accent + 2px offset) · active (scale 0.98)
- Loading → skeleton matching content shape, not a spinner
- Animate `transform` and `opacity` only — never `width` `height` `top` `left`
- Max 800ms on any animation. Always respect `prefers-reduced-motion`

## Copy

- Plain English, specific, conventional terms
- No em dash, no decorative emoji, no AI-marketing filler
- No lorem ipsum, no "Feature Title", no "User Name" in rendered UI

---

## Mandatory double-check after ANY frontend work

After building or changing `apps/web` UI, run this checklist **before** calling the work
done. It is **code-based — no rendering / screenshots needed** (those burn tokens and the
preview often isn't available). The point is to catch the silent bugs that pass a casual
code read: broken sticky, invisible blur, hero focal competition.

Run it in two passes. Part A is mechanical greps — run them, paste the output, do not
eyeball it. Part B is targeted code reading of three files.

### Part A — Mechanical greps (run the commands, report output)

Run from `apps/web/src`:

```
[ ] No overflow-x-hidden on any sticky ancestor (it silently kills position: sticky):
      grep -rn "overflow-x-hidden\|overflow-hidden" app/ components/
      → any hit on the layout shell, body, or a sticky header's wrapper is a FAIL.
        Use overflow-x-clip instead, or constrain the element that actually overflows.

[ ] Header background is partly transparent so backdrop-blur is visible:
      grep -rn "backdrop-blur" components/
      → the same element must use bg-background/80 (or similar), not /95 or a solid fill.

[ ] No raw hex or raw palette classes (tokens only):
      grep -rEn "#[0-9a-fA-F]{3,6}|(bg|text|border)-(red|blue|green|zinc|slate|violet|indigo|emerald|teal|orange|amber)-[0-9]" app/ components/
      → any hit is a FAIL.

[ ] No heavy near-black panel in the hero/first viewport:
      grep -rn "bg-foreground" app/page.tsx
      → bg-foreground on a large hero panel is a FAIL (steals the focal point).
        It is fine on a late-page CTA band or the footer.

[ ] Background token is still white/neutral (only the accent changed):
      grep -n "\-\-background" styles/globals.css
      → must be 0 0% 100% or a near-neutral; any warm/cream value is a FAIL.

[ ] No off-grid spacing:
      grep -rEn "(p|m|gap|space)[a-z-]*-\[[0-9]" app/ components/
      → arbitrary values like p-[10px], gap-[14px] are FAILs.

[ ] pnpm lint passes (catches min-h-screen, and the patterns lint is wired to block)
[ ] pnpm verify passes
```

### Part B — Read three files and reason (no render)

Open `app/page.tsx`, `app/layout.tsx`, and the site-header, then confirm by reading the markup:

```
[ ] Header has `sticky top-0` AND no overflow on its ancestors (cross-checks Part A) →
    the nav will actually pin on scroll.
[ ] The hero is one focal point: the headline + primary action carry the first section;
    no sibling element uses a heavy dark/inverted surface or competes at equal weight.
[ ] The hero is not wrapped in a card (no bg-card/border/rounded around the headline block),
    and there is no min-h-screen or oversized top padding pushing it down.
[ ] Footer markup has a real endcap: a top border/surface, brand/wordmark, link group(s),
    and a copyright line — not two muted text lines.
[ ] Sections are mostly open bands. Count the `bg-card`/`border ... rounded` wrappers: if
    nearly every section is boxed, that is card soup — FAIL.
[ ] A font is wired in layout.tsx via next/font and bound to --font-sans.
```

Reading the markup is enough for everything above — none of it needs a screenshot. The one
thing code cannot fully confirm is exact visual balance and fold height at a given screen
size; if that ever matters, note it as the residual risk rather than rendering by default.
