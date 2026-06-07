# Frontend

> Stack: Next.js (App Router) · React · TypeScript · Tailwind · Supabase.
> Open this for any `apps/web` work. Goal: ship something that feels **professionally designed and human-made - not a generic AI site** (but still modern and sharp).

> This file is the universal frontend rulebook. It sets guardrails and quality bars, not
> the exact layout for every product. Product-specific visual identity, references,
> navigation model, page UX, layout choices, and copy tone live in `docs/UI_UX.md`.
> `docs/UI_UX.md` must follow this file, not override it.
>
> The starter UI in `apps/web` is a design-quality reference and wiring example, not a
> layout template. Preserve its discipline: clean composition, restrained surfaces,
> non-boxy hierarchy, real navigation and footer treatment, deliberate typography, and
> small purposeful interactions. Do not copy its exact layout, section order, spacing
> values, copy, or starter brand as the default for real products. Build the actual UI from
> the user's brief, `docs/UI_UX.md`, and selected references, while obeying the guardrails
> in this file.
>
> For products in a known vertical, read the matching `docs/verticals/*.md` playbook before
> finalizing `docs/UI_UX.md`. The playbook gives genre-specific instincts, while this file
> remains the universal frontend guardrail.

## Design Craft (read first)

The default failure mode of AI-built UIs is "generic." Don't ship that. The goal is a real product made by humans: calm, intentional, production-ready. Prioritize clarity, restraint, consistency, usability, and readability over decoration.

**Two tests to keep applying:** if a screen could be any AI demo, it is not done. If an element exists only to look "cool", it should not exist. Every visual element needs a reason.

**Clean is the constant, whatever the product is.** This template builds every kind of site:
ecommerce, SaaS, dashboards, marketing, editorial, internal tools. The final result must be
clean in all of them: uncluttered, restrained, intentional, easy to scan, with a clear focal
point and real whitespace. "Clean" is not the same as "sparse" or "empty" - a dense
marketplace can be clean if its density is organized. The opposite of clean is clutter:
competing focal points, decoration with no purpose, surfaces stacked on surfaces, and noise.
No product type is an excuse to ship a busy, messy page.

**Target vibe:** a real product company website designed by experienced frontend engineers and product designers. It should feel structured, editorial, balanced, calm, professional, trustworthy, scalable, and production-ready.

**Starter design DNA:** the default `apps/web` screen shows the intended level of taste,
not the required page structure. Carry forward the feel: open sections instead of card soup,
hierarchy from spacing and type before borders, a sticky navbar with a real surface,
route-aware links, a complete footer endcap, one strong visual/media moment when useful,
and a restrained closing CTA. Replace the product content, routes, palette, layout model,
and density for each project. The starter is successful when it teaches "clean, mature,
not AI-generic", not when every product looks like the starter.

**Further reading:** the fastest way to build this judgment is _Refactoring UI_ (Adam Wathan and Steve Schoger). Its tactical rules - hierarchy through spacing and weight, restraint with borders, one clear focal point per screen - are exactly what separates a human-made UI from AI slop. Before designing for a specific product type, study the real references in `docs/REFERENCES.md`, then record the chosen direction in `docs/UI_UX.md`.

### Forbidden patterns (the AI tells)

Do not use:

- Default violet/indigo gradients, glassmorphism, glow, or blur as decoration.
- Any palette that reads as a template default, not just violet/indigo. Whatever look is in
  heavy AI rotation is a tell: violet/indigo, emerald/forest + cream editorial, muted sage,
  the dark-purple "SaaS gradient", teal-on-near-black, flat beige minimalism, and whatever
  comes next. These are examples, not a blocklist. The specific colors keep changing; the
  failure is reaching for a safe trendy default instead of a deliberate, product-specific
  palette with a real accent.
- Random horizontal dividers or decorative separators with no functional purpose.
- Emoji as UI/section markers, or excessive uppercase micro-labels.
- Cinematic or floating decorative text; fake futuristic styling.
- Decorative dual-colored headlines, split-color phrases, or mixed heading colors without a system.
- Decorative numbering like [01], [02].
- Random serif-italic fonts dropped in "for contrast".
- Shipping the browser default font. If no typeface is wired through `next/font` and bound to
  `--font-sans`, text falls back to Times/serif or a bland system stack. That "weird, wrong"
  default font is an instant tell. Wire a deliberate modern typeface (see Typography below).
- Untouched shadcn defaults (looks like every other demo).
- Fake placeholder logo marks, such as an invented initials tile, random badge, or generic
  icon standing in for a real brand asset. Use the product's real mark, the template icon,
  or a clean wordmark until branding exists.
- Narrow centered site shells that leave huge dead gutters on desktop. Public pages and
  dense app pages should feel wide and edge-aware, with small side gutters and content
  that uses the available viewport intentionally.
- Floating UI elements, random cards, badges, and panels that do not carry real information.
- Fake dashboard aesthetics, Dribbble-style visual overload, experimental layouts with no UX purpose.
- Fade-in-on-everything motion, gratuitous parallax, constantly moving elements.
- Generic portfolio aesthetics: tiny centered labels, decorative rules, large type paired with thin filler copy, and vague skill cards.
- Flat plain-text pages where everything has the same weight and rhythm. Avoid long blocks
  of unstyled text with no meaningful emphasis, links, inline metadata, lists, or hierarchy.
- Hard horizontal section borders that cut across any viewport near the middle of the screen. If the next section is visible, it must feel intentionally connected to the current section, not like a page slice with a divider line.
- Short pages where the footer is visible on initial load below a sparse form, confirmation, or auth panel. The footer should feel like the end of a complete page, not a second section appearing because the main content is too short.
- Card soup: wrapping the shell, nav, filters, tables, forms, lists, metrics, and every
  content block in separate bordered cards. Cards are one grouping tool, not the default
  layout language. Mature products build most hierarchy from spacing, alignment, type,
  density, and section rhythm.
- A paper prototype look: too many pale bordered rectangles, weak one-note neutrals, low
  contrast product images, tiny quiet controls, and large empty bands that make the page
  feel printed instead of usable.
- Cards or borders used to separate content that spacing, type scale, and weight already separate. A box must earn its place; if removing it loses no clarity, remove it. Mature products (Linear, Stripe, Notion) build hierarchy from spacing, not by wrapping everything in a card or ruling it off with a divider.
- Every action pushed to the top level to look "feature-rich". Don't line up every icon and button inline, or add columns and stats a page doesn't need. Use progressive disclosure: secondary actions belong in a row's context menu or a clickable item; supporting data belongs on its own view.
- Audience-mismatched metrics or operational data shown to look "serious." Public and
  customer-facing pages should not show internal KPIs, admin counters, workflow coverage,
  revenue summaries, stock alert counts, sample order values, checkout targets, or other
  dashboard-like data unless that information directly helps the user's current decision.
- Subheadings that merely restate the page. A visitor who navigated to "API Keys" does not need "Manage your API keys" under the heading. Drop the explanatory subtitle unless it carries real, non-obvious information.
- shadcn inset / segmented ("pill") tabs used for primary, page-level navigation. Those are for supplemental, in-context switching (e.g. Preview / Code). Top-level navigation uses a sidebar or underlined tabs.
- Public UI that exposes implementation details: database/provider names, API health checks,
  response timings, build metadata, internal route names, debug panels, stack badges, or
  "powered by Supabase/Midtrans/Hono" copy. Real users should understand the product, not
  the plumbing behind it.
- Invisible navigation: nav text floating directly on the page with no deliberate surface,
  background, border, blur, band, sidebar rail, or other visual treatment. Navigation must
  read as a persistent product control, not as loose text that disappears into the content.
- Animations longer than 800ms on any user interaction. Slow animations feel laggy and break the "instant" contract.
- CSS transitions on layout properties: `width`, `height`, `top`, `left`, `margin`, `padding`. These cause layout reflow and drop frames. Animate `transform` and `opacity` only.
- Multiple competing animations playing simultaneously in the same viewport area.
- Looping animations on static content. Only intentional loading states (shimmer, spinner) should loop.
- More than three font weights in a single product (`400`, `500/600`, `700` is the maximum).
- Arbitrary spacing values outside the 4px grid (`10px`, `14px`, `18px`, `22px`, `36px`).
- Generic stat strips, fake dashboard panels, or internal KPI counters dropped onto public pages just to look "data-driven".

### Do instead

- **Have an identity.** Commit to a real palette, a deliberate type scale, and a consistent spacing rhythm as design tokens, not Tailwind defaults sprinkled ad-hoc.
- **Build on the starter — do not generate a fresh layout from scratch.** The starter ships
  with the right foundation: open-band composition, white surface, sticky nav, real font
  wiring, and a structured footer. Keep that. Change the accent palette, content, copy, and
  routes per product. Record layout deviations in `docs/UI_UX.md` only when the product
  genuinely needs a different structure (e.g. sidebar dashboard vs. marketing page).
- **Customize components.** shadcn/ui is a starting point, not the look. Tune radius, weight, density, and color so it does not read as "default shadcn."
- **Use honest brand assets.** Do not invent a fake initials logo or placeholder mark just
  to fill the navbar. Use the provided product logo/icon, the template icon if no brand
  exists yet, or a disciplined text wordmark. Replace visible brand marks only when the
  user provides or approves product-specific branding.
- **Wire a real, modern typeface.** Never rely on the browser/system default. Load a
  deliberate modern sans through `next/font` in the root layout and bind it to the
  `--font-sans` token (the template ships this wired with a modern variable font; swap the
  family for a product-appropriate one, keep the token). Pick something that reads as a
  designed choice, not a framework default. One or two families at most, no decorative or
  serif-italic-for-aesthetics switches. Build hierarchy with spacing, weight, and size.
- **Use rich text with restraint.** Pages should not feel like raw plaintext. Use emphasis,
  inline links, short lists, metadata rows, captions, helper text, keyboard hints, and
  occasional callouts where they improve scanning or comprehension. Keep it purposeful:
  no rainbow text, random bolding, decorative italics, or markdown-looking clutter.
- **Lay out with structure.** Use a proper responsive grid, strong alignment, and clear section flow. Whitespace should create hierarchy; it should not become dead empty space.
- **Prefer open composition before boxes.** The starter intentionally uses open grids,
  bands, typography, and one earned media frame instead of wrapping every idea in a card.
  Follow that instinct unless the product domain needs denser framed modules, like product
  cards, tables, dialogs, or repeated list items.
- **Let the product choose the layout.** `docs/UI_UX.md` owns the product's actual layout
  direction: top nav vs sidebar, editorial vs dashboard, table vs list, dense vs spacious.
  This file should not force every product into the same page shape. Follow UI_UX.md, then
  apply the quality checks here.
- **Match container width to content density.** Pick the width the content actually fills,
  do not default everything to the widest container. Dense surfaces (dashboards, catalogs,
  galleries, product grids, data tables) go wide with small gutters and sit close to the
  viewport edges like a real product. Sparse content (a marketing hero, a short landing
  section, an auth card) needs a contained measure (~1100-1280px centered) so it reads as a
  composed page. Both extremes fail: a dense page trapped in a narrow centered column, and
  sparse content flung across an extra-wide container so the navbar and hero end up with
  empty middles and dead side gutters. A too-wide shell for thin content is just as much an
  AI tell as a too-narrow one. Narrow reading columns (prose, forms) live inside a wider
  layout.
- **Compose against real viewport heights.** Design every major section and section transition to read as complete. Watch for the patterns that break this when reading the markup: a `border-t`/`border-b` band with large blank padding sitting between two sections, or a section whose only content is a short centered block in a tall container. Fix these in the markup; you do not need to render to spot them.
- **Make the hero land in the first viewport.** On a landing/home page, the headline, its
  supporting copy, and the primary CTA must be visible without scrolling at common desktop
  heights (~720-768px) and on mobile. The user
  should never have to scroll just to see the hero. The navbar must not eat the fold, and
  oversized top padding or a too-tall nav that pushes the headline below the fold is a fail.
  Achieve this by restraining vertical spacing and content volume, not by forcing a section
  to `min-h-screen`/`100vh` (that is forbidden and lint-blocked). A full-height flex page
  shell with a centered hero and a bottom-anchored footer is the right pattern.
- **Anchor the primary navbar.** Public and app primary navigation should stay pinned while
  the user scrolls (`sticky top-0` with a real surface: token background, subtle bottom
  border, and/or backdrop blur so it stays readable over content). A nav that scrolls away
  makes a long page feel unfinished. Keep it from covering anchor targets with
  `scroll-margin-top`. Reserve non-sticky nav for focused reading/auth layouts where a
  persistent bar would distract.
- **Give short flows a complete screen.** Auth, onboarding, empty states, confirmation pages, and other short views need enough meaningful content, layout structure, or a dedicated auth shell so the footer does not appear without scrolling on desktop. Do not add filler; use helpful context, trust notes, preview panels, or remove the marketing footer for that route type if the app structure calls for it.
- **Use motion with taste.** Motion is encouraged when it improves clarity, feedback, or
  polish. Keep it subtle, fast, and purposeful: small hover responses, menu open/close,
  tab/content transitions, loading skeletons, toasts, and state changes. Avoid decorative,
  cinematic, scroll-hijacking, or repeated page-wide animations. Users should notice
  smoothness, not the animation.
- **Use cards deliberately.** Before adding a card, ask what it groups and what would break
  if the border/background were removed. Prefer open lists, section bands, table rows,
  inline controls, typography, and whitespace when they communicate the structure more
  cleanly.
- **Make pages feel alive through useful interaction and hierarchy.** A page can feel warm
  and active without being noisy: clear clickable affordances, responsive controls,
  meaningful icons, product imagery, focused color accents, and well-structured density do
  more than full-page animation or decorative clutter.
- **Give navigation a real surface.** A navbar/sidebar/bottom nav needs a deliberate visual
  home: background band, token surface, subtle border, sidebar rail, backdrop treatment, or
  another product-appropriate container. It does not need to be a card, but it must be
  visible on every route and stay readable over any content behind it.
- **Use icons where they speed recognition.** Commerce, marketplace, dashboard, and tool
  interfaces often need familiar icon + label controls so users can scan actions quickly.
  Use icons to clarify common actions, not as decoration.
- **Make clickable things look clickable.** Links, buttons, rows, cards, and text actions
  must communicate interactivity before hover. If normal body text is clickable, give it a
  visible affordance such as underline, stronger color, icon, button treatment, or a clear
  adjacent action cue.
- **Show information for this audience and task.** A public buyer page, a seller dashboard,
  an admin console, and a finance report need different data. Keep operational metrics,
  internal counters, and dashboard stats out of customer-facing pages unless they answer a
  real customer question.
- **Respect hierarchy and whitespace.** One clear focal point per screen, intentional alignment, generous spacing. Polish over decoration.
- **Accessibility is craft.** Real focus states, sufficient contrast, keyboard paths. Pros do this, and it reads as human.

### Icons In Buttons And Controls

Icons can make a product feel more alive and easier to scan, especially in ecommerce and
marketplace UIs where users expect quick visual entry points. Use them intentionally:

- Prefer `lucide-react` icons, already available through `packages/ui`, before adding a new
  icon dependency.
- Add icons to controls when the symbol is familiar and improves recognition: search,
  cart, checkout, shop, store/seller, category grid, filter, sort, voucher, discount, flash
  sale, location, delivery, user/account, notifications, menu, and directional arrows.
- Do not add icons to every button by default. Text-only buttons are often better for
  secondary copy-heavy actions, legal/help links, destructive confirmations, or flows where
  the icon adds no new meaning.
- Primary CTAs should usually keep a text label. Add a leading or trailing icon only when it
  reinforces the action, such as "Shop products" with a shopping bag, "Start selling" with
  a store, or "View all categories" with an arrow or grid.
- Icon-only buttons are for compact controls with universal meaning, such as search, cart,
  menu, close, or more actions. They need an accessible `aria-label` and a clear focus
  state.
- Icon + label controls are the best default for scan-heavy navigation, category shortcuts,
  and utility actions when there is enough room. Icon-only controls are appropriate only
  when the symbol is universally recognized or the layout is compact.
- Text + optional icon is the safer default for major CTAs, because the wording carries the
  action and the icon reinforces it.
- Keep icon size and stroke weight consistent with the component density. Most text buttons
  should use 16px or 18px icons aligned with `gap-2`; oversized icons make controls feel
  childish.
- Category, deal, and marketplace entry points should often use icon + label patterns
  because they create useful visual rhythm and make dense commerce pages easier to scan.
  The icons must map to real product categories or actions, not generic decoration.

### Click Affordance

Users should not have to guess what can be clicked.

- Text links need a visible link treatment before hover: underline, token color, icon,
  button/ghost button styling, or a clear arrow/action cue. Do not rely on cursor changes
  or hover-only styling to reveal that text is clickable.
- Section-level actions such as "View all", "Browse product list", "Manage settings", or
  "See details" should read as actions. Prefer an arrow icon, underline, or ghost button
  treatment instead of plain body text.
- Clickable cards or rows need an affordance beyond being inside a card: title link
  styling, hover/focus surface change, trailing arrow, visible row action, or a clear
  "Open" / "View details" control.
- Hover states should confirm interactivity, not be the first sign of it. Use hover for
  reinforcement: color shift, underline, icon movement, background shift, or subtle shadow.
- Focus states must be visible for keyboard users. Any link or button with custom styling
  still needs a clear focus-visible ring or equivalent treatment.
- Do not style non-clickable labels like links. If text is colored, underlined, or paired
  with a directional icon, users will assume it does something.

### Audience-Appropriate Information

Do not show data just because it exists.

Every visible number, stat, badge, panel, and data row should pass this test: does this help
the current user make the next decision on this route? If not, remove it or move it to the
right context.

- Customer-facing public pages should focus on product value, browsing, pricing, trust,
  availability, delivery, social proof, and the next action. They should not show internal
  operations, admin stats, revenue, workflow coverage, stock alert counts, sample order
  values, or performance targets.
- Operational dashboards may show KPIs, queues, revenue, alerts, and workflow metrics, but
  only to the role that can act on them.
- Marketing proof points must be meaningful to the audience. "100K+ products" can help a
  marketplace feel stocked; "seller workflow coverage P0" or "checkout target < 3 min" is
  internal planning language and should not appear in user-facing UI.
- Avoid fake dashboard panels on public pages. They often read as filler and make the
  product feel less trustworthy.
- If a number is shown, label it in plain user language and place it near the decision it
  supports. Do not group unrelated metrics into stat strips just to fill space.
- Keep internal implementation, roadmap, and operational language in docs, admin routes, or
  seller/admin dashboards, not public buyer pages.

### Layout Checks

- Every section must answer: what is this for, what should the user notice, and what comes next?
- Cards must contain meaningful information or actions. If a card exists only to fill a grid
  or make the UI feel "designed", remove it.
- Keep a surface budget per page. The app shell, primary navigation, filter bars, tables,
  forms, and repeated list rows should not all be separate card surfaces at once. Choose the
  few surfaces that clarify grouping, then let everything else breathe.
- Every viewport segment must feel complete. If a section boundary appears inside any visible viewport while scrolling, it must be visually integrated through overlapping content, continuous background treatment, or a deliberate editorial reveal. A plain full-width border line near mid-screen is a fail.
- Desktop gutters should be deliberate and small. A layout with large empty rails on both
  sides is a fail unless the route is a focused reading/form page and the rest of the
  composition still feels complete.
- Short pages must still feel designed as full pages. If the footer is visible before scrolling, the content above it must be dense and complete enough that the footer reads as a natural page end. A small form floating above a visible footer is a fail.
- Keep borders, shadows, corner radius, and hover states restrained and consistent.
- Test mobile and desktop for stable spacing, readable line lengths, and no awkward empty zones.
- Prefer real product references and mature design systems over AI-generated landing page patterns.

### Self-review (code-based, no rendering)

Reading this file is not the same as applying it. The most common failure is an agent that read these rules and still shipped something that feels like a generic template instead of this product. So before you consider any `apps/web` UI finished, **do a self-review** by reading your own markup and running the mechanical greps in the `docs/DESIGN_DNA.md` double-check.

This review is **code-based — do not render the page or take screenshots** (it burns tokens and the preview often isn't available). Judge the checks below from the markup: container widths, breakpoint classes (`sm:`/`md:`/`lg:`), section structure, surface usage, and the grep results. The one thing code cannot fully confirm is exact visual balance and fold height at a specific pixel size; treat that as residual risk and note it rather than rendering by default.

**Layout (the failures that make a page read as AI-built):**

- [ ] The container class does not leave large dead side gutters on wide desktops. Content aligns to a defined container; background bands may run full-bleed, but content is never stranded in a narrow centered column with empty sides.
- [ ] Container width matches content density. Sparse content (hero, short landing, auth) is contained to a composed measure, not flung across an extra-wide shell that leaves the navbar and hero with empty middles. Dense pages (dashboards, catalogs, grids) go wide. Neither extreme is present.
- [ ] The main page shell uses small, intentional side gutters via its container/padding
      classes. It is not a fixed ~1280px island that would float in the middle of a large
      monitor.
- [ ] No hard full-width section divider (a `border-t`/`border-b` band with large blank padding) sits between sections where the next section would be partly visible. Section transitions read as intentional continuations, not page breaks.
- [ ] Scrolling through the page does not reveal "stacked slices" where each section is separated by a border and large blank vertical padding. Section transitions have rhythm, overlap, continuous background, or enough adjacent content density to feel natural.
- [ ] On short routes such as sign in, sign up, onboarding, empty states, and confirmations, the footer is not visible on initial desktop load unless the content above it forms a complete, dense page. A sparse form plus visible footer is a fail.
- [ ] On the landing/home page, the hero headline, supporting copy, and primary CTA are visible without scrolling at ~720-768px desktop height and on mobile. The navbar does not push the hero below the fold.
- [ ] The primary navbar is anchored (sticky) on scroll with a real surface, and does not scroll away or sit on the page as invisible floating text.
- [ ] Spacing rhythm is consistent and deliberate, not random vertical gaps.
- [ ] Cards, borders, and dividers are load-bearing: removing one would lose real grouping or meaning. Nothing is boxed or ruled off when spacing already separates it.
- [ ] The page is not "cardy": shell, nav, filters, data table/list, forms, metrics, and
      side panels are not all boxed independently. At least some hierarchy comes from
      typography, alignment, spacing, section rhythm, or open list/table structure.
- [ ] The page does not feel like a paper prototype: pale bordered rectangles, weak
      one-note neutrals, faded imagery, quiet controls, and empty bands are not carrying
      the design.
- [ ] Primary navigation uses a sidebar or underlined tabs, not inset/segmented ("pill") tabs; inset tabs appear only for supplemental in-context switching.

**Content & identity:**

- [ ] Every card, badge, stat, and panel carries real information or a real action. Nothing exists only to fill a grid.
- [ ] Color comes from the tokens in `globals.css` and reads as a deliberate product palette, not whatever look is currently in heavy AI rotation (violet/indigo, forest + cream, muted sage, dark-purple SaaS gradient, and the like). No default-shadcn look, no glassmorphism/glow/blur as decoration.
- [ ] Visible brand/logo treatment uses a real approved asset, the template icon, or a
      clean wordmark. It does not use an invented initials tile or generic placeholder mark.
- [ ] A deliberate modern typeface is wired through `next/font` / `--font-sans`; text is not the browser default serif or a bland system stack. One or two font families; hierarchy is built from size, weight, and spacing. No decorative serif-italic, no mixed heading colors.
- [ ] Copy is plain and specific. No AI-marketing filler, no em dash, no decorative emoji, no `[01]`-style numbering.
- [ ] Rich text is used where it helps scanning: useful emphasis, inline links, lists,
      metadata, captions, helper text, and callouts. The page is neither flat plaintext nor
      over-styled decoration.
- [ ] No subheading merely restates its page or section title; every heading earns its place.
- [ ] The screen isn't overloaded: secondary actions live in menus, and no column, stat, or panel is present that the page doesn't need.
- [ ] Public/customer-facing pages do not show audience-mismatched metrics, internal KPIs,
      admin counters, workflow coverage, revenue summaries, stock alert counts, sample order
      values, or performance targets unless they directly support the user's task.
- [ ] Public UI does not leak implementation details: no provider names such as Supabase,
      Midtrans, Hono, or Hugging Face unless the product is explicitly developer-facing and
      the user asked to show them; no API latency numbers, health-check status, internal
      route names, commit hashes, environment names, build IDs, or debug diagnostics.
- [ ] Icons in buttons and controls are used where they improve scanning, not everywhere by
      default. Icon-only controls have accessible labels and visible focus states.
- [ ] Clickable text, cards, and rows are visibly interactive before hover. Plain body text
      is not used as the only affordance for a link or action.

**Structure & states:**

- [ ] Public pages have a navbar and a footer. No bare screen.
- [ ] Every route has persistent navigation appropriate to its context. Public pages have
      a public navbar; signed-in app pages have a consistent app navbar/shell; auth pages
      have a focused auth header. Navigation must not disappear on deeper pages.
- [ ] Navigation has a visible background/surface treatment. It is not invisible floating
      text, and it remains readable against the page at every scroll position and
      breakpoint.
- [ ] Every persistent nav item highlights the active route, including mobile navigation.
      Use `aria-current="page"` and a visible active state. Parent sections may stay active
      for child routes, but unrelated links must not be highlighted.
- [ ] Every route has a footer or footer-equivalent endcap appropriate to its context.
      Public pages use product/legal/footer links; app pages use compact app/legal/help
      context; auth pages use a quiet footer. The footer adapts to context, but it is not
      omitted.
- [ ] The footer has a visible treatment (top border or surface band, brand, links,
      copyright) and reads as a deliberate endcap, not two faint muted lines floating at the
      bottom of the page.
- [ ] Auth pages use an intentional auth layout. The footer must be present, but the main
      auth content should still feel complete enough that the footer reads as a natural
      end, not as filler exposed by sparse content.
- [ ] The route/page matches `docs/UI_UX.md`: navigation model, page UX intent, visual system, copy tone, and product-specific layout direction.
- [ ] Primary navbar links navigate to real routes/pages. They do not scroll to sections
      farther down the same landing page.
- [ ] The route graph is connected. Users can move between public, auth, and app contexts
      without getting trapped. App shells include a clear route back to the public/landing
      site or product home, and public/auth routes link into sign in/sign up/app as
      appropriate.
- [ ] If the page uses section anchors, they are secondary links only (for example a table
      of contents, footer links, or in-page contextual navigation), not the primary navbar.
      Anchor links use real `#section-id` targets with offset and reduced-motion behavior.
- [ ] A new or changed view matches the shared scaffold of its sibling pages: page title, primary actions, and filters sit in the same place with the same alignment, same container, same spacing. No one-off per-page layout.
- [ ] The layout adapts across breakpoints (behavior changes, not just scaled-down). Checked at mobile and desktop.
- [ ] Empty, loading, and error states are designed, not just the happy path.

**Code-based evidence (no rendering):**

- [ ] I ran the Part A greps from `docs/DESIGN_DNA.md` and pasted the output (overflow-x-hidden on sticky ancestors, raw hex/palette classes, bg-foreground in the hero, off-grid spacing, background token still neutral).
- [ ] I read `app/page.tsx`, `app/layout.tsx`, and the site header and reasoned about section structure: open bands vs card soup, hero focal point, sticky ancestors, footer endcap, container widths.
- [ ] I checked short public routes' markup (sign in, sign up, empty states) for enough content/structure that the footer is not exposed by a sparse panel.

This review is code-based by design. `pnpm lint && pnpm typecheck` passing does **not** cover the above — a build can be green and the page still AI-generic — but reading the markup and running the greps does. Rendering is only a last-resort tie-breaker for exact visual balance, not a required step.

## App Structure & Page Flow

A first-time visitor lands on a real **landing page**, not a login wall. This is the single most common AI mistake: given a PRD, agents wire `/` straight to `/signin`. Don't.

- **`/` is a public landing page.** It explains the product and links to sign in / get started. Never auto-redirect an unauthenticated visitor from `/` to the auth pages.
- **Auth pages** (`/signin`, `/signup`) are reachable _from_ the landing page, not forced before it.
- **The app itself** (dashboard, account, anything user-specific) lives behind auth. **Only these protected routes** redirect to sign in when the visitor is signed out.
- **Routes connect both ways.** A signed-in dashboard is not a dead end. The app shell must
  include a clear route back to the public site/product home, and public/auth shells must
  expose the expected path into sign in, sign up, or the app. Users should never need the
  browser back button to move between major contexts.

Every page ships with navigation chrome and a footer/endcap. There are three route contexts:

- **Public layout** wraps the landing page and other marketing/public routes: a **navbar**
  (logo, primary route links, sign in / get started) and a **footer** (product links,
  legal, copyright) on every page.
- **App layout** wraps signed-in routes: a persistent app navigation shell. The product may
  choose a top navbar, sidebar, or hybrid in `docs/UI_UX.md`, but the nav must be present
  on every app page, stay consistent across routes, and clearly highlight the current page.
  App pages also need a compact footer/endcap with contextual links or status, not a bare
  dead end.
- **Auth layout** wraps sign in, sign up, reset, and onboarding routes: focused header,
  focused content, and a quiet footer with product/legal/help context.

**Do not ship a page with no navigation or no footer/endcap.** A bare screen with no
persistent navigation and no contextual end is the AI tell that there was no real
information architecture behind it.

The footer needs a visible treatment, the same way navigation does. A real footer reads as a
deliberate endcap: a top border or surface band, the brand/wordmark, route or legal links,
and a copyright line. Two faint lines of muted text floating at the bottom of the page do not
read as a footer even though the markup is technically there. Give it structure.

Navigation must be visibly present, not merely technically present in the DOM. Give public,
app, and auth nav a deliberate surface/background treatment that fits the product: a full
width bar, sidebar rail, bottom nav, subtle border band, solid/blurred token surface, or
another clear visual home. Avoid nav links that float invisibly over the page background.
Primary navigation should normally stay anchored (sticky) while scrolling so it remains a
persistent control, with a surface that keeps it readable over any content behind it.

Major route contexts must cross-link:

- Public nav includes the primary public pages plus sign in/get started and, when signed-in
  state is available, a route into the app.
- App nav includes the product/app sections plus a clear route back to the public landing
  or product home. The logo can do this only if its destination is obvious; otherwise add a
  labeled link such as "Home", "Website", or the product name.
- Auth nav includes a way back to the public landing page and the alternate auth route
  (sign in <-> sign up) when relevant.
- Footer/endcap links reinforce the same route graph instead of being decorative.

### Primary and In-page Navigation

Primary navbar links go to real pages/routes: `/features`, `/pricing`, `/blog`, `/app`,
`/signin`, and similar. Do not wire the primary navbar to scroll down the same landing
page. A visitor clicking a top-level nav item expects navigation, not an in-page jump.

Persistent route navigation must show the active page:

- **Use route-aware active states.** In Next.js, put active nav in a small client component
  that reads `usePathname()`, or pass the current route from the layout when practical.
  Set `aria-current="page"` on the active link and apply a visible state such as stronger
  text, an underline, a side rail, or a quiet background. Do not rely on hover-only styles.
- **Handle exact and parent matches intentionally.** `/app` should be active only for the
  dashboard route unless UI_UX.md defines it as a parent section. `/app/transactions`
  should highlight Transactions on `/app/transactions` and its child routes.
- **Keep mobile and desktop in sync.** If the desktop nav highlights the active route, the
  mobile drawer/menu/bottom nav must highlight the same route.

When a long page is split into sections that secondary links point to:

- **Use real anchor links.** Each section has a stable `id`; secondary links point to
  `#that-id`, and a footer "back to top" link targets the top of the page. Avoid JS
  click handlers that manually scroll.
- **Keep anchors secondary.** Use section anchors for footer links, table-of-contents links,
  long-form docs, or contextual page navigation. Do not put section anchors in the primary
  navbar.
- **Show the active section when useful.** For secondary in-page navigation, the link for the section currently in view gets a restrained active state (a color or weight change, or a small underline drawn from the design tokens, never a flashy animated pill). Detect the visible section with `IntersectionObserver`, not scroll-event math, and set `aria-current` on the active link so it is not signalled by color alone.
- **Smooth scroll, cheaply.** Enable it in global CSS (`scroll-behavior: smooth` on `html`). Do not add a scroll-hijacking library (Lenis, Locomotive, GSAP ScrollSmoother and friends): that is an over-engineered AI tell.
- **Offset the sticky header.** Give linked sections `scroll-margin-top` (Tailwind
  `scroll-mt-*`) equal to the sticky header height, so the heading is not hidden after a
  jump.
- **Respect reduced motion.** Gate smooth scroll and any transition behind `@media (prefers-reduced-motion: no-preference)`. A visitor who asks for less motion gets instant jumps, not animation.
- **Keep the client boundary small.** Active-section tracking needs the client, so put it in a small `'use client'` nav component; do not turn the whole page client-rendered for it (see Rendering Strategy).

This is the right kind of motion: subtle and functional, never cinematic. Keep it minimal (see "Do instead").

### Metadata, Title, And Icons

Browser tab titles should be short and page-specific. Use a compact pattern like
`Projects | AppName`, `Pricing | AppName`, or `Sign in | AppName`. Do not use long SEO
sentences, taglines, or full marketing copy in the browser tab.

Rules:

- Default root metadata lives in `apps/web/src/app/layout.tsx`.
- Product pages set short page titles through Next metadata.
- Keep page names to a few words. If the title wraps awkwardly in a browser tab, it is too
  long.
- Use the product name, not a long value prop, as the app title suffix.
- Metadata that is visible to users must describe the product/page, not the stack. Do not
  put provider names, environment labels, build hashes, API status, or performance timings
  in titles, descriptions, visible badges, or footer copy.
- The template ships default icons in `apps/web/src/app/favicon.ico` and
  `apps/web/src/app/icon.png`. Replace them only when the user provides product-specific
  branding.
- Render a real logo mark in the navbar, do not invent a placeholder tile or drop a generic
  lucide icon in a colored square as the brand. The starter shows the pattern: it imports
  `app/icon.png` and renders it with `next/image` next to the wordmark. Reuse the product's
  real logo when it exists, otherwise the template `icon.png` plus a clean wordmark. A
  generic lucide icon dropped in a colored tile standing in for a brand is a fail.

### Consistent Page Behavior

Pages of the same kind must behave consistently, but they do not all need the same visual
layout. `docs/UI_UX.md` chooses the product's composition. This file only requires that
similar pages keep predictable interaction patterns: navigation, active states, primary
actions, filtering, empty/loading/error states, and responsive behavior.

- **Share behavior primitives.** Reuse route-aware nav links, page actions, filters, empty
  states, tables/lists, dialogs, forms, and footer/endcap patterns. Do not force a single
  visual scaffold when the product direction calls for another composition.
- **Same content type, same expectations.** All list pages should make searching,
  filtering, row actions, empty states, and pagination easy to find. They can still differ
  visually when UI_UX.md says they should.
- **Persistent shell.** The app shell stays mounted across navigation; only the content
  region swaps. Do not re-implement the shell per route.
- **Reuse, do not re-style.** Shared behavior and primitives live in shared components
  (`packages/ui` or an app-level layout folder). Tune their appearance to the product
  system instead of restyling each page from scratch.
- **Consistent spacing and density.** Same family of spacing, type scale, and density across
  a product. This does not mean every page has the same grid or the same card stack.

## Theming & Color

All color lives in **one file**: `apps/web/src/styles/globals.css`. It is the single source of truth, so retheming or adding a brand is a one file change.

- Colors are **semantic CSS custom properties** (`--background`, `--primary`, `--muted`, ...), not raw values scattered through components.
- **Ship one theme first.** The active theme is defined in `:root` (light by default). A dark theme (`.dark`) is provided commented out in `globals.css`; enable it only when the product actually needs dark mode. Do not generate both on day one.
- Because every theme uses the **same token names** with different values, adding a second theme later never touches a component.
- Components reference **tokens only** (`bg-background`, `text-foreground`, `border-border`). Never hardcode hex, and never use raw palette classes like `bg-zinc-900`.
- One `--radius` knob controls roundness across the UI.

Typography is wired the same way: a `next/font` family in the root layout sets the
`--font-sans` token, which `tailwind.config.ts` maps to `font-sans` and `globals.css` applies
to `body`. To change the product's typeface, swap the font family in the root layout and keep
the token. Never leave it unset, that falls back to the default serif/system font.

Wiring (done once, when the app is scaffolded):

1. Import `globals.css` in the root layout.
2. In `tailwind.config.ts`, set `darkMode: 'class'` and map the tokens to Tailwind colors:

   ```ts
   theme: {
     extend: {
       colors: {
         background: 'hsl(var(--background))',
         foreground: 'hsl(var(--foreground))',
         border: 'hsl(var(--border))',
         primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
         // same pattern for secondary, muted, accent, destructive, card, popover
       },
       borderRadius: {
         lg: 'var(--radius)',
         md: 'calc(var(--radius) - 2px)',
         sm: 'calc(var(--radius) - 4px)',
       },
     },
   }
   ```

3. **Only when you add a second theme:** uncomment the `.dark` block in `globals.css`, then toggle by adding or removing `class="dark"` on `<html>`. Use `next-themes` (`<ThemeProvider attribute="class">`) for system plus manual switching. A single-theme app skips this step entirely, do not add `next-themes` for one theme.

To rebrand: edit the token values in `:root` in `globals.css`. That is the only file you touch.

## Content & Copy

- All user facing copy is in **clear, standard English**.
- Use **conventional, well known terms** for features. Do not invent names or jargon for things that already have a common name (a "Sign in" button is "Sign in", not a coined word).
- **No em dash** in UI copy or content. Use a comma, a period, a plain hyphen, or rephrase. Keep punctuation clean and standard.
- **Minimize emoji** and skip decorative symbols. Use an emoji only when it carries real meaning, never as decoration or a section marker.
- Avoid AI-sounding marketing language, fake technical terminology, and meme-style writing. Keep wording concise, natural, and familiar.
- Avoid generic phrases such as "crafting digital experiences", "building with passion", "clarity and purpose", and "innovative solutions".
- Do not use placeholder content, fake feature names, or invented labels when normal product language would be clearer.

### Rich Text And Scannability

Use rich text to make real content easier to scan, not to decorate a weak layout.

Good uses:

- Emphasize a key number, status, product term, or warning with weight, not random color.
- Use inline links inside explanatory copy when the next step matters.
- Use short lists, definition rows, captions, and metadata for dense product information.
- Use helper text near controls and forms when it prevents mistakes.
- Use compact callouts for important context, limits, next steps, or confirmations.

Avoid:

- Random bold words in every sentence.
- Decorative italics, mixed heading colors, gradient text, or highlighted phrases with no
  information value.
- Large markdown-looking pages where bullets replace real UI structure.
- Rich text that hides actions. Primary actions still need clear controls.

## Internationalization (i18n)

**Ship one language first: English.** Don't generate `en` + `id` (or any second language) on day one. But still centralize text from the start, so adding a language later is a one-file job instead of a rewrite.

- Text lives in `apps/web/src/i18n/locales/<locale>.json`, one file per language. Day one, that is just `en.json`.
- **English (`en`) is the default and the source of truth.** No hardcoded strings in components, even in a single-language app.
- Components read text through the dictionary, typed from `en.json`, so a missing or renamed key becomes a type error. With one locale you pass `defaultLocale` directly, no `[lang]` route needed:

  ```tsx
  import { getDictionary } from '@/i18n/dictionaries';
  import { defaultLocale } from '@/i18n/config';

  export default async function Page() {
    const t = await getDictionary(defaultLocale);
    return <h1>{t.app.tagline}</h1>;
  }
  ```

- **Format, don't concatenate.** Numbers, currency, and dates come from `Intl`, never string building. IDR has no decimal places, so `Rp 1.294,5` is a bug: `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(1294.5)` gives the correct `Rp 1.295`. Same for dates via `Intl.DateTimeFormat`.
- Keep each full phrase as one key. Do not build sentences by concatenating translated fragments, since other languages order words differently.

**Adding a language later** (only when you actually need it):

1. Copy `en.json` to the new locale (e.g. `id.json`), translate the values, keep the keys identical.
2. Register it in `config.ts` (`locales`, `localeNames`) and add its loader in `dictionaries.ts`.
3. Move pages under `app/[lang]/...` and read the locale from `params.lang`.
4. Add a small middleware (redirect `/` to the default locale, optionally honor `Accept-Language`) and a switcher that links to the current path under the other locale.

A single-locale app needs none of step 3 or 4.

## Rendering Strategy

- **Server Components by default.** Reach for `'use client'` only when you actually need interactivity, browser APIs, local state, animation, or realtime.
- Don't make a whole page client-side for one interactive widget - push the client boundary down to the smallest leaf.

## Data Fetching

- Fetch on the **server** whenever possible; keep client-side fetching minimal.
- No duplicate server + client requests for the same data.
- Use streaming / progressive rendering where it improves perceived speed.
- Use `loading.tsx` with designed **skeletons** (not bare spinners).

## Code Splitting

- Lazy-load heavy / non-critical features: charts, editors, maps, modals, media viewers, admin tools.
- Don't pull large libraries into the initial bundle unless they're needed above the fold.

## Performance

Optimize for, in order: (1) fast initial load, (2) responsive interactions, (3) smooth navigation, (4) minimal hydration, (5) small bundle.

Avoid: unnecessary client state, deeply nested providers, excessive re-renders, animation libs everywhere, heavy deps for simple tasks.

## Images

- Use `next/image` for anything non-trivial; lazy-load below-the-fold media.
- Compress assets, no oversized files, and set dimensions to avoid layout shift.

## States, Errors & Responsiveness

Design every state, not just the happy path. A screen that only handles "data loaded successfully" is half-built.

**Empty states.** When there is no data yet (no transactions, no budgets, no reports, empty search results), show a calm screen with a one-line explanation of what goes here and a clear action button to add the first item. Never a blank area or a raw "no data" string.

**Error states.** Handle failed network requests, invalid form input, missing data, server errors, and empty filter/search results. Rules:

- Plain language, no stack traces, codes, or jargon. Say what happened and what to do next.
- Give a way forward: a retry button, a link back, or a fix-the-input hint.
- Validate forms **inline**, next to the field, as the user goes. Don't dump every error at the top after submit.

**Loading states.** Use `loading.tsx` with designed **skeletons** that mirror the real layout, not bare spinners. Transitions stay subtle and fast.

Skeleton rules:
- The skeleton must match the **exact shape** of the loaded content — same height, same proportions, same grid. A generic rectangle where a product card goes is not a skeleton.
- Use a **shimmer animation** (background gradient sweeping left-to-right) rather than opacity pulse. The motion direction matches reading direction.
- Skeletons must appear within **100ms** of navigation. A blank white flash before the skeleton is a fail.
- Skeleton → content transition: the skeleton fades out while the real content fades in. No layout shift. No position jump.

**Motion.** The rule is not "no motion." The rule is no noisy motion. Add motion when it
communicates state, confirms interaction, or makes a transition feel polished. Prefer CSS
transitions and tiny client components before reaching for animation libraries. Keep
durations short, easing natural, and every animated surface useful. Always respect
`prefers-reduced-motion`.

**Animation timing — use only these durations, never invent new ones:**

| Token | Duration | Use for |
| ----- | -------- | ------- |
| instant | 80ms | Button press, checkbox, micro feedback |
| fast | 150ms | Hover states, small element transitions |
| normal | 250ms | Standard UI transitions, dropdowns |
| slow | 400ms | Modals, drawers, page content fade |
| slower | 600ms | Charts, counters, complex reveals |

Never exceed 800ms on any interaction — it breaks the "instant" contract and feels laggy.

**GPU-only rule.** Only animate `transform` and `opacity`. Never put CSS transitions on
`width`, `height`, `top`, `left`, `margin`, or `padding` — those trigger layout and drop
frames. Use `transform: translate()` instead of `top`/`left`. Use the CSS grid trick
(`grid-template-rows: 0fr → 1fr`) instead of animating height for accordion/collapse.

**Easing guide:**
- Elements entering the screen → ease-decelerate `cubic-bezier(0, 0, 0.2, 1)` (starts fast, slows to rest)
- Elements leaving → ease-accelerate `cubic-bezier(0.4, 0, 1, 1)` (ends quickly)
- Toggles, notifications, likes → spring `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy, tactile)
- Most UI transitions → ease-standard `cubic-bezier(0.4, 0, 0.2, 1)` (balanced)

**Scroll animations** use `IntersectionObserver`, never scroll event listeners. Trigger at 80% element visible. Play once only — do not repeat on re-scroll.

**Interactive component states.** Every interactive component must implement all of these states before it is considered done:

| State | Requirement |
| ----- | ----------- |
| Default | How the element looks at rest |
| Hover | Visible color/shadow/border shift within 150ms |
| Focus | `focus-visible` ring: 2px accent ring + 2px offset. Never `outline: none` without a replacement |
| Active/Pressed | `scale(0.98)` + background darkens within 80ms — tactile press feel |
| Loading | Spinner replaces text; element width locked to prevent layout shift; `aria-busy="true"` |
| Disabled | `opacity: 50%`; `cursor: not-allowed`; no hover or click response |
| Error | Red border + error message below field; shake animation on submit; `role="alert"` |
| Empty | Icon + title + description + CTA. Never just blank space or "No data" |

Do not ship a component missing any state that its domain needs. A button without a loading state, a form without inline errors, or a table without an empty state is half-built.

**Spacing discipline.** Use a 4px base grid. Only these values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px. Never use arbitrary values like 10px, 14px, 18px, 22px, 36px. In Tailwind: `p-1` (4px), `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `p-12` (48px), `p-16` (64px). Arbitrary `p-[10px]` is a violation.

**Typography discipline.** Max three font weights per product: `400` (body), `500` or `600` (medium), `700` (bold). Never use `300` (too light at small sizes), `800`/`900` (too heavy for UI text). Font sizes must come from the defined scale — avoid intermediate sizes like `13px`, `15px`, `17px`, `18px`, `22px`. Max line length for body text: 65–75 characters. Use `max-w-prose` or `max-w-[65ch]` for reading columns.

**Responsive behavior: adapt, don't shrink.** Layout should change behavior across breakpoints, not just scale down.

- Sidebar collapses to a drawer or bottom nav on mobile; the navbar becomes a menu.
- Multi-column card grids stack to one column; tables become cards or scroll deliberately, never overflow the viewport.
- Charts re-flow to fit; touch targets stay at least ~44px.
- Avoid the tells: a squeezed desktop layout, tiny tap targets, and tables that overflow the screen.
- Test every breakpoint mobile to desktop.

## Production Mindset

Build for **stable, scalable, maintainable, production-ready** frontend delivery. Not experimental, not overengineered.
