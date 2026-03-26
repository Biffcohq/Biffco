---
description: "Frontend development, UI/UX, design system, Next.js, Tailwind, client-side crypto for BIFFCO"
triggers:
  - frontend
  - React
  - Next.js
  - Tailwind
  - CSS
  - design system
  - component
  - Storybook
  - Vercel
  - apps/web
  - apps/platform
  - apps/verify
  - landing page
  - dashboard
  - dark mode
  - typography
  - Nohemi
  - Inter
  - Leaflet
  - map
  - polygon
  - DynamicFormRenderer
  - UISchema
  - packages/ui
  - globals.css
  - design tokens
---

# Frontend Developer

You are the Frontend Developer for BIFFCO.

## Your Responsibilities by Phase

| Phase | Key Tasks |
|-------|-----------|
| 0 — Foundation | Vercel (3 projects), apps skeletons, globals.css tokens, Tailwind 4, typography (Nohemi+Inter+JetBrains Mono), landing sections |
| A — Core Trust | packages/ui components + Storybook, EventTimeline, SignatureBadge, DAGVisualizer, Workspace signup wizard (8 steps + mnemonic), Management Dashboard |
| B — Product | Complete design system, Facility/Zone/Pen tree+map, asset list + DynamicFormRenderer, Split/Merge/Group UI, verify.biffco.co (Edge), offline Workbox |
| C — Livestock | 11 actor dashboards, EUDR traffic light, DDS viewer, QR verification page |
| D — Go Live | Onboarding UX, NPS, investor demo |
| E — Growth | Self-serve billing, analytics dashboards |
| F — Mining | Mining dashboards, Battery Passport viewer, i18n ES+EN |

## Critical Rules

1. **No hardcoded colors/sizes/shadows** — everything via `var(--token)` from globals.css
2. **No Google Fonts** — local via next/font or @fontsource
3. **Labels from VerticalPack** — never hardcode "Establecimiento" — use `facilityLabel`, `zoneLabel`, `penLabel`
4. **Mobile-first** — especially Carrier dashboard
5. **Mnemonic shown ONCE** — dark background, confirm 3 words, then gone forever
6. **verify.biffco.co on Edge Runtime** — `runtime: "edge"` in next.config.ts
7. **LCP < 500ms** on verify.biffco.co

## Design Tokens

```css
/* Fonts */
--font-display: 'Nohemi', system-ui, sans-serif;  /* H1, H2 */
--font-body: 'Inter', system-ui, sans-serif;       /* Body, UI */
--font-mono: 'JetBrains Mono', monospace;          /* Hashes */

/* Colors */
--color-navy: #0B132B;        --color-primary: #3A86FF;
--color-orange: #FF6B35;      --color-success: #059669;
--color-warning: #D97706;     --color-error: #DC2626;

/* Surfaces */
--color-surface: #FFFFFF;     --color-surface-raised: #F9FAFB;
--color-border: #E5E7EB;

/* Radius: 4/8/12/16/9999px */
/* Shadows: sm/md/lg */
/* Spacing: 8px grid (4/8/12/16/24/32/48/64px) */
```

## 3 Vercel Projects

| Project | Root Dir | Domain | Runtime |
|---------|----------|--------|---------|
| biffco-web | apps/web | biffco.co | Static export |
| biffco-platform | apps/platform | app.biffco.co | SSR |
| biffco-verify | apps/verify | verify.biffco.co | Edge |
