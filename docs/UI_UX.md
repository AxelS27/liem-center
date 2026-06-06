# UI/UX Brief - <Project Name>

<!--
  Product-specific design source of truth.

  FRONTEND.md defines the universal UI rules for this template.
  UI_UX.md defines the identity and UX direction for THIS product.

  Fill this after PRD.md and FEATURES.md, before generating PROGRESS.md.
  Use the user's design brief, product scope, and selected REFERENCES.md examples.
  When the product matches a known vertical, read the matching docs/verticals/*.md playbook
  and capture the relevant choices here.
  Do not inherit the starter UI's layout by default. Use it as taste calibration only:
  clean, open, restrained, non-boxy, and mature. The product's actual structure, density,
  palette, imagery, and route composition must come from this brief.
  Do not copy long rules from FRONTEND.md. Point to them when needed.
-->

## Summary

<!--
  One short paragraph. What should the product feel like, and why does that fit
  the audience and problem?
-->

## Design Inputs

<!--
  Capture what the user asked for. If a section is unknown, ask instead of inventing.
-->

- **User direction:**
- **Vertical playbook:** <docs/verticals/ECOMMERCE.md / none / other>
- **Closest vertical from REFERENCES.md:**
- **Reference products/sites:**
- **Starter design DNA to keep:** <clean/open/non-boxy/restraint/nav-footer polish/motion/media/none>
- **Starter UI patterns not to copy:** <exact layout/section order/placeholder copy/starter brand/other>
- **Things the user explicitly likes:**
- **Things the user explicitly dislikes:**

## Product Personality

<!-- Pick 3-5 traits that guide tradeoffs. Avoid vague words unless explained. -->

- <Trait> - <what this means in UI decisions>
- <Trait> - <what this means in UI decisions>

## Layout Principles

<!--
  Product-specific layout rules. FRONTEND.md gives guardrails; this section chooses the
  product's actual layout direction. Keep it concrete enough to guide pages, but not so
  detailed that it becomes CSS.
-->

- **Primary layout model:** <top navbar / sidebar / hybrid / editorial / dashboard / other>
- **Page composition:** <how landing, list, detail, form, and dashboard pages should feel>
- **Surface budget:** <where cards/panels are allowed, and where open lists, sections,
  tables, or typography should carry hierarchy instead>
- **Open composition:** Define how the product should avoid a boxy or paper-prototype feel:
  which areas stay open, which sections can use bands, and which content truly earns a
  framed card/panel.
- **Navigation placement:** Primary nav links navigate to real routes/pages, not same-page
  section jumps. Define whether public/app nav uses a top navbar, sidebar, bottom nav, or
  drawer at each breakpoint.
- **Navigation surface:** Define the visible nav treatment: background band, sidebar rail,
  border, blur, solid token surface, or another product-appropriate surface. Nav must not
  be invisible floating text. Primary nav should normally be anchored (sticky) on scroll.
- **First viewport:** The landing hero (headline, supporting copy, primary CTA, and for
  commerce the search/shop entry) must fit the first screen without scrolling at ~720-768px
  desktop height and on mobile. Note any product-specific above-the-fold priorities.
- **Route connectivity:** Define how users move between public, auth, and app contexts.
  App pages need a clear route back to the public landing/product home; public/auth pages
  need clear routes into sign in, sign up, or the app.
- **Footer model:** Every route has a footer or footer-equivalent endcap. Define what
  public, app, and auth footers contain for this product.
- **Desktop gutters:** Use wide page shells with small desktop gutters unless the route is
  a focused reading or form page.

## Visual System

<!--
  This guides globals.css, shared components, and page composition.
  Exact token values may live in globals.css; explain the design intent here.
-->

- **App name for metadata:**
- **Browser title pattern:** `<Page> | <AppName>`
- **Icon/brand asset direction:** Use the template default icon/mark or a clean wordmark
  unless the user provides product-specific branding. Do not invent placeholder initials,
  random logo tiles, or generic marks that pretend to be a real brand.
- **Color direction:** Commit to a deliberate product palette. Avoid the tired AI-starter
  defaults (violet/indigo, emerald/forest + cream editorial, muted sage, dark-purple SaaS).
- **Typography direction:** Name the actual typeface(s). A modern family wired via `next/font`
  to `--font-sans`, never the browser default serif/system font.
- **Density and spacing:**
- **Non-boxy hierarchy:** How should spacing, type weight, alignment, section rhythm,
  imagery, and inline metadata carry hierarchy before adding borders or cards?
- **Rich text/scannability:** Where should emphasis, inline links, captions, metadata,
  lists, helper text, or callouts be used to make content easier to scan?
- **Audience-appropriate data:** Which metrics, counts, badges, and operational data are
  useful for each route context? Public/customer pages should not show internal KPIs or
  admin/seller operational data unless the user can act on it.
- **Radius and borders:**
- **Cards and surfaces:** Where should cards be used, and where should hierarchy come from
  spacing, typography, open lists, tables, or section bands instead? Define how the product
  avoids card soup and a paper-prototype feel while still feeling clear and balanced.
- **Imagery/product visuals:**
- **Icon style:** Define where icons help users scan controls and entry points. Prefer
  familiar `lucide-react` icons for actions such as search, cart, category, filter, deal,
  store/seller, checkout, account, delivery, and arrows; avoid decorative or mismatched
  icons. Specify which controls are icon-only, icon + label, text + optional icon, or
  text-only.
- **Motion:**

## Navigation Model

<!--
  List the intended top-level pages. Keep primary nav route-based.
-->

- `/` - <landing purpose>
- `/features` - <purpose>
- `/pricing` - <purpose, if applicable>
- `/blog` - <purpose, if applicable>
- `/signin` - <purpose>
- `<protected route>` - <purpose>

## Page UX Map

<!--
  One row per important route or area. This is product-specific UX intent, not
  implementation status. Implementation status lives in PROGRESS.md.
-->

| Route / Area | User goal | Primary action | Layout notes                   | States needed                     |
| ------------ | --------- | -------------- | ------------------------------ | --------------------------------- |
| `/`          | <goal>    | <action>       | <product-specific composition> | <empty/loading/error if relevant> |
| `<route>`    | <goal>    | <action>       | <notes>                        | <states>                          |

## Components And Patterns

<!--
  Reusable UI patterns this product should feel consistent around.
  Put shared implementation tasks in PROGRESS.md.
-->

- **Buttons and CTAs:** Define which primary and secondary actions use icon + label,
  text-only, or icon-only controls. Do not put icons on every button by default; use icons
  where they clarify the action or make dense navigation/category/deal surfaces easier to
  scan. For compact universal controls, icon-only is allowed with accessible labels; for
  major CTAs, keep the text label primary.
- **Navigation active states:** How active navbar/sidebar/bottom-nav links look, including
  mobile.
- **Route links:** How public, app, and auth shells link to each other so no context becomes
  a dead end.
- **Click affordance:** Define how text links, section actions, clickable cards, and rows
  look interactive before hover. Plain body text should not be the only clue that something
  is clickable.
- **Footer/endcap:** Contextual footer content for public, app, and auth routes.
- **Cards/lists/tables:** Include a surface budget so the UI does not become card-heavy.
- **Product/list metadata:** For commerce or catalog products, define how names, prices,
  discounts, ratings, sold counts, stock, delivery, seller/location, category badges, and
  actions are visually distinguished.
- **Metrics and stats:** Define which stats are shown to public users, signed-in users,
  sellers, admins, or finance users. Avoid generic stat strips and internal planning data
  on customer-facing pages.
- **Forms:**
- **Empty states:**
- **Error states:**
- **Loading states:**

## Copy Tone

<!--
  Product-specific voice. Still obey FRONTEND.md: clear English, no filler,
  no decorative emoji, no em dash in UI copy.
-->

- **Voice:**
- **Words to use:**
- **Words to avoid:**
- **Example headline style:**
- **Example button style:**

## Responsive Rules

<!-- Product-specific breakpoint behavior that PROGRESS.md should turn into tasks. -->

- Mobile:
- Tablet:
- Desktop:

## Accessibility Notes

<!-- Anything specific beyond FRONTEND.md and QUALITY.md. -->

- Keyboard:
- Focus states:
- Contrast:
- Motion sensitivity:

## Explicit UI Non-Goals

<!--
  Product-specific design directions to avoid. These should mirror user dislikes
  and any relevant PRD non-goals.
-->

- <thing not to design>
- <thing not to design>

## Sync Checklist

Before building or updating PROGRESS.md:

- [ ] This brief matches `docs/PRD.md` goals and non-goals.
- [ ] This brief covers all relevant `docs/FEATURES.md` modules.
- [ ] This brief follows `docs/FRONTEND.md`; any conflict is resolved in favor of FRONTEND.md.
- [ ] Selected references come from, or are added to, `docs/REFERENCES.md`.
- [ ] Route/page intent here is reflected as tasks in `docs/PROGRESS.md`.
- [ ] Any API/data needs implied by UX are reflected in `docs/API.md` and `packages/types`.
