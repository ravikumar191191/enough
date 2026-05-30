# Backlog — Enough

A living, prioritized list of improvements, grouped into **releases** we ship one at
a time. Process for every item: build on `develop` → check the Vercel preview link →
test → merge to `main` (production).

> A **backlog** is the maintained to-do list for a product — the single place ideas
> land so nothing lives only in our heads. Each item has a short *what* + *why* and a
> priority. We re-rank as we learn.

**Priority key:** P0 = blocks understanding/usage · P1 = important · P2 = nice-to-have.

---

## Aligned product decisions (2026-05-30)

From the persona evaluation ([docs/evaluations](docs/evaluations/2026-05-30-v0.7.md)):
- **Goal:** portfolio-first, but product-ready — don't foreclose a real-product path.
- **Salary:** model per-geography (₹ India, $ US). ✅ done in v0.8.
- **First-run:** add a quick/guided mode (progressive disclosure) — in v0.9.
- **v0.8 theme:** Trust & fidelity.
- **Principal-PM gaps to close:** define + instrument success metrics; validate with
  real users; articulate strategy (wedge/moat/distribution).

## v0.8 — "Trust & fidelity" (on develop preview)

- **F1 · Per-geography salary (P0, ✅ done).** Separate ₹ (India) and $ (US) salary per
  earner, each applied only to its country. Fixes the "same person earns the same
  everywhere" unrealism that eroded trust.
- **F2 · Asking-price caveat near the answer (✅ done).** Directional/not-advice note in
  the summary card, not just the footer.
- **F3 · Per-row "show the math" expander (P1, next).** Expand a ranked row to see the
  derivation (home + transaction cost, annual-spend breakdown, corpus = uncovered ÷ SWR,
  total). The #1 trust ask from P1.
- **F4 · Per-geography SWR? (subjective — needs decision).** India ≈2.5% vs US ≈3.5%
  vs keep one global rate. Trade-off: realism vs apples-to-apples comparison.

## v0.9 — "Reach & usability" (next)

> Adopted from the Figma Make comparison ([eval](docs/evaluations/2026-05-30-figma-vs-ours.md)).
> **Rule: borrow Figma's UX patterns, never its data or model** (both were broken).

- **U1 · Quick/guided mode** — essentials first, advanced controls behind a reveal
  (P2 time-to-value). _(aligned; Figma proved the layout)_
- **U2 · India-only / US-only / both filter** (P3 relevance; cheap, high value). _(Figma had it)_
- **U5 · Editable number next to each slider** — type an exact salary / net worth (P1
  precision + a11y). Keep the slider for feel; add an inline editable value. _(Figma had it)_
- **U3 · Open-Graph share card** — per-scenario preview image so every shared link is a
  billboard (L1 growth loop). Needs a serverless/OG-image step.
- **U4 · Privacy-friendly analytics** (Vercel/Plausible) — we currently ship blind;
  instrument completion, shares, control usage. _(principal-PM gap: metrics)_
- **C3 · Redesign the funding bar** into an unmistakable meter (the "funded today" label
  in v0.7 was the stopgap).
- **B6 · Stack the two age sliders on very narrow phones** (`grid-cols-1 sm:grid-cols-2`).

## v0.10 — "Sourced breadth & depth" (later)

- **U6 · More cities — ONLY with sourced data.** Prioritize the no-income-tax US door
  (Austin TX, Miami FL) and India breadth (Chennai). Surface "No State Tax" for those.
  *Gate: real, dated prices/tax/lifestyle — unsourced cities would break our trust moat.*
- **B3 · v6.1 features:** geography-aware lifestyle equivalence; school-board selector
  (ICSE/CBSE/IB + US public/private); RNOR flag with a one-line note. _(SPEC §6)_
- **U7 · (maybe) numeric AQI / livability signal** instead of a binary flag — informative
  for P3, but needs sourced seasonal data; keep it a light signal, not a ranking factor.
- **U8 · (maybe) per-category annual breakdown** (Housing/Lifestyle/Kids/School) as the
  collapsed quick view, with our exact derivation ledger as "show the math."

## Later

- **B5 · 380px viewport e2e test** in CI (Playwright). _(review)_
- **B2 · True LLM-written summary** — needs a serverless function for the API key.
- **B4 · v7 features:** other-income slot, USD/INR net-worth split (FX risk), LTCG
  withdrawal drag, sensitivity view. _(SPEC §6)_
- **Validate with real target users** (principal-PM gap) — get the app in front of 3–5
  real India/US-weighing couples and capture where they get stuck or disbelieve it.

## Done

- **v0.10 · U3 Open-Graph share card + U4 privacy-friendly analytics** _(2026-05-30)_ —
  per-scenario card via Vercel Edge (`/api/og`, `/share`); cookieless Vercel Web Analytics
  with `share` / `arrived_from_share` events. Verified on the develop preview.
  _(Manual step: enable Web Analytics in the Vercel dashboard.)_
- **v0.9 · U1 Quick/Advanced mode, U2 India/US/Both filter, U5 editable number inputs**
  _(2026-05-30)_ — shipped to production. Plus **San Diego** added (first sourced
  city from the breadth backlog).
- **v0.8 · F1 per-geography salary, F2 asking-price caveat, F3 per-row "show the math"**
  _(2026-05-30)_ — shipped to production.
- **v0.7 · C1–C5, C3a — comprehension pass** _(2026-05-30)_ — product explainer, headline
  ⓘ explainers, school note, "move-in costs" label, "Funded today"-labeled bars. On
  develop preview (PR awaiting review → merge to production).
- **B1 · Plain-English input summary** _(2026-05-29; `src/components/InputSummary.tsx`)_ —
  3–4 sentence recap of all inputs + the lowest "enough" with a one-line "why", under the
  headline. Reactive. On `develop`; ships to production with v0.7.
