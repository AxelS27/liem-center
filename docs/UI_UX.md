# UI/UX Brief - <Project Name>

<!--
  Product-specific design source of truth.

  FRONTEND.md defines the universal UI rules for this template.
  UI_UX.md defines the identity and UX direction for THIS product.

  Fill this after PRD.md and FEATURES.md, before generating PROGRESS.md.
  Use the user's design brief, product scope, and selected REFERENCES.md examples.
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
- **Closest vertical from REFERENCES.md:**
- **Reference products/sites:**
- **Things the user explicitly likes:**
- **Things the user explicitly dislikes:**

## Product Personality

<!-- Pick 3-5 traits that guide tradeoffs. Avoid vague words unless explained. -->

- <Trait> - <what this means in UI decisions>
- <Trait> - <what this means in UI decisions>

## Layout Principles

<!--
  Product-specific layout rules. These must not conflict with FRONTEND.md.
  Keep this concrete enough to guide pages, but not so detailed that it becomes CSS.
-->

- Use wide page shells with small desktop gutters unless the route is a focused reading or form page.
- Primary navbar links navigate to real routes/pages, not same-page section jumps.
- <Product-specific layout rule>
- <Product-specific layout rule>

## Visual System

<!--
  This guides globals.css, shared components, and page composition.
  Exact token values may live in globals.css; explain the design intent here.
-->

- **App name for metadata:**
- **Browser title pattern:** `<Page> | <AppName>`
- **Icon/brand asset direction:** Use the template default icon unless the user provides
  product-specific branding.
- **Color direction:**
- **Typography direction:**
- **Density and spacing:**
- **Radius and borders:**
- **Imagery/product visuals:**
- **Icon style:**
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

| Route / Area | User goal | Primary action | Layout notes                       | States needed                     |
| ------------ | --------- | -------------- | ---------------------------------- | --------------------------------- |
| `/`          | <goal>    | <action>       | <wide/asymmetric/content-led/etc.> | <empty/loading/error if relevant> |
| `<route>`    | <goal>    | <action>       | <notes>                            | <states>                          |

## Components And Patterns

<!--
  Reusable UI patterns this product should feel consistent around.
  Put shared implementation tasks in PROGRESS.md.
-->

- **Buttons and CTAs:**
- **Cards/lists/tables:**
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
