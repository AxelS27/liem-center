# Features - <Project Name>

<!--
  Complete feature scope for the product, broken into modules.
  Detail lives here so docs/product/PRD.md stays short: the PRD defines WHAT and WHY,
  this file lists the concrete capabilities that deliver it.
  Fill this in after the PRD is agreed, and keep every feature inside the PRD's
  Non-Goals. If something here contradicts a Non-Goal, change the PRD first.
-->

> Scope is bounded by `docs/product/PRD.md`. Nothing here may contradict the PRD Non-Goals.

## Build phases

Everything listed is in scope. Phases set the order of work, not whether a feature ships.

- **P0** - Core loop. The smallest version that is genuinely useful end to end.
- **P1** - Complete product. The features that make it feel finished.
- **P2** - Depth and polish. Still in scope, built once P0/P1 prove out.

Tag every capability below with `P0`, `P1`, or `P2`.

---

<!--
  One section per feature module. Format:

    ## N. <Module name>
    <One line: what this module is for.>
    - <capability> `P0`
    - <capability> `P1`

  Rules:
  - Group by feature/module, not by screen or file type (see docs/engineering/ARCHITECTURE.md).
  - Each bullet is one concrete, buildable capability, not a vague theme.
  - Use conventional product terms, not invented names (see docs/engineering/FRONTEND.md).
  - Auth, foundation/UX (landing, onboarding, empty states), and settings are
    features too: give them their own modules.
  - Delete these example modules once you start filling in real ones.
-->

## 1. <Module name>

<One line: what this module is for and why it exists.>

- <capability> `P0`
- <capability> `P1`

## 2. <Module name>

<One line purpose.>

- <capability> `P0`
- <capability> `P2`

---

## Explicitly out of scope

<!--
  Mirror the PRD Non-Goals as concrete features you are NOT building, so neither
  a human nor an agent adds them by drift. Each would need a PRD change first.
-->

- <thing you are deliberately not building>
- <thing you are deliberately not building>
