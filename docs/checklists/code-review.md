# Code Review Checklist

> Run this before approving any PR or marking a task done.
> A green lint + typecheck does not cover any of the UI or architecture checks below.

---

## Architecture

```
□ Each file has one clear responsibility (describable in ≤ 5 words)
□ No feature imports directly from a sibling feature
    → features/orders importing from features/inventory is a violation
    → Shared data goes through packages/ or app-level shared layer
□ No business logic / calculations inside JSX render
    → Math, filtering, sorting inside component return → move to utils/ or a hook
□ No API calls (fetch, supabase queries) inside component bodies
    → Data fetching belongs in server components, route handlers, or custom hooks
□ No circular imports
□ No magic numbers inline in components — use named constants in config
□ No hardcoded hex values in JSX className or style props
    → Use token classes: bg-background, text-foreground, border-border, etc.
□ No hardcoded Tailwind raw palette classes (bg-zinc-900, text-blue-500, etc.)
    → Use semantic token classes only
□ Relative imports go up at most one level (../../ is a smell; ../../../ is a violation)
□ No props drilling beyond 3 levels — lift state or use context
□ No useState for derived data (compute it from existing state instead)
□ No useEffect for derived data (useMemo or direct computation)
```

---

## UI / Visual Quality

```
□ No page could be any AI demo — it has a real product identity
□ Palette comes from globals.css tokens, not raw Tailwind colors or hardcoded hex
□ A deliberate typeface is wired via next/font; text is not the browser default serif
□ Max 3 font weights used: 400, 500/600, 700
□ All spacing follows the 4px grid (p-1, p-2, p-4, p-6, p-8, p-12, p-16...)
    → No p-[10px], gap-[14px], or other arbitrary off-grid values
□ Every interactive component has all required states:
    □ Default — how it looks at rest
    □ Hover — visible color/shadow change within 150ms
    □ Focus — 2px accent ring + 2px offset via focus-visible (never outline: none without replacement)
    □ Active/Pressed — scale(0.98) + background darkens within 80ms
    □ Loading — spinner replaces text, width locked, aria-busy="true"
    □ Disabled — 50% opacity, cursor not-allowed, no hover response
    □ Error — red border + error message below, role="alert"
    □ Empty — icon + title + description + CTA (not just blank space or "No data")
□ Loading skeletons match the exact shape of the content (not generic rectangles)
□ Shimmer animation exists in globals.css; skeleton components use it
□ No page is "card soup" — cards are used where they earn their place
□ No paper-prototype feel — pale bordered rectangles are not carrying the design
□ Hero fits the first viewport at ~720px desktop height on landing/public pages
□ Primary navbar is sticky with a visible surface treatment
□ Active nav link has aria-current="page" and a visible active state
□ Footer has a visible treatment on every public route
```

---

## Animation & Motion

```
□ All animations use only GPU-composited properties: transform and opacity
    → No transitions on: width, height, top, left, margin, padding
□ All animation durations ≤ 800ms
□ Durations come from the timing scale (80ms / 150ms / 250ms / 400ms / 600ms)
□ prefers-reduced-motion is respected (global rule in globals.css + component-level gates)
□ No looping animations on static content (only loading states loop)
□ No multiple competing animations in the same viewport area simultaneously
□ Scroll animations use IntersectionObserver, not scroll event listeners
□ Page shell (navbar, sidebar) does not animate on navigation — only the content area
```

---

## Accessibility

```
□ All images have alt text (empty string for decorative images)
□ All form inputs have associated <label> elements (htmlFor)
□ Color is never the only differentiator (always paired with text or icon)
□ Touch targets ≥ 44×44px on mobile
□ Modals trap focus and close on Escape
□ Focus rings visible after keyboard Tab (no outline: none without replacement)
□ Dynamic status changes use aria-live (toasts, loading state announcements)
□ Icon-only buttons have accessible aria-label
□ aria-current="page" set on active nav links
```

---

## Security

```
□ No hardcoded secrets, API keys, or passwords in code
□ All user inputs validated with Zod at route handler boundary before any logic runs
□ SUPABASE_SERVICE_ROLE_KEY not referenced in apps/web
□ No dangerouslySetInnerHTML without DOMPurify
□ No user-controlled href without URL protocol validation
□ Sensitive data (auth tokens, PII) not stored in localStorage
```

---

## Performance

```
□ No import * from any library (breaks tree-shaking)
□ No console.log in committed code
□ Heavy components and route pages lazy-loaded (React.lazy / dynamic import)
□ No anonymous functions in JSX event handlers that recreate on every render
    → onClick={() => handleDelete(id)} → wrap with useCallback
□ No unnecessary re-renders on unrelated state changes
□ List pages with > 100 items virtualized
```

---

## Docs Sync

```
□ If a new API endpoint was added: docs/API.md updated
□ If schema changed: docs/DATABASE.md data model updated + migration committed
□ If a major architectural choice was made: docs/DECISIONS.md entry added
□ If a feature shipped: docs/PROGRESS.md updated (feature marked done)
□ If payment logic changed: docs/PAYMENTS.md updated
□ pnpm docs:check passes
```

---

## Final Gate

```
□ pnpm verify passes (lint + typecheck + tests)
□ UI work rendered and self-reviewed at mobile, 1366x768, 1440x900, 1920x1080
□ No route is a dead end — public ↔ auth ↔ app contexts all cross-link
□ The Definition of Done in docs/QUALITY.md is satisfied
```
