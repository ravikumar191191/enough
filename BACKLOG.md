# Backlog — Enough

A living, prioritized list of improvements, grouped into **releases** we ship one at
a time. Process for every item: build on `develop` → check the Vercel preview link →
test → merge to `main` (production).

> A **backlog** is the maintained to-do list for a product — the single place ideas
> land so nothing lives only in our heads. Each item has a short *what* + *why* and a
> priority. We re-rank as we learn.

**Priority key:** P0 = blocks understanding/usage · P1 = important · P2 = nice-to-have.

---

## v0.7 — "Make it understandable" (in progress)

The theme: a first-time visitor must grasp *what this is* and *what the numbers mean*
without scrolling or guessing. (From real user feedback, 2026-05-30.)

- **C1 · Product explainer (P0).** Name + tagline don't convey the job. Keep the name
  "Enough" but rewrite the tagline as a plain value statement and add a one-line "how
  it works", so a stranger gets it in 5 seconds. *Why:* shareable product = must
  self-explain on landing.
- **C2 · Explain the headline numbers (P0).** "61% funded today" and "≈8 yrs · funded
  by age 42" are unexplained. Add tappable ⓘ on each ("funded" = net worth ÷ the total
  you need; "years" = time for net worth to grow into the target at your real return).
  Also ship **B1** (the plain-English summary) to production — it already narrates this.
- **C4 · Clarify the two School controls (P1).** Not obvious you keep both. Add a note:
  India tier applies to Indian cities, US tier to US cities — both show because the
  table spans both geographies.
- **C5 · Clarify "One-time setup" (P2).** Rename to "One-time setup costs" and tighten
  the tooltip so it's clear what it covers and that the number is your input.
- **C3a · Label the funding bar (P1, partial).** Add a clear "funded" label so the bar
  reads as information now; full visual redesign is v0.8.
- **B1 · Plain-English input summary (done, ships with this release).** See Done.

## v0.8 — "Signal vs input" (next)

- **C3 · Redesign the funding bar (P1).** Today's half-filled rounded bar reads like a
  slider (an input). Replace with an unmistakable *read-out* element — e.g. a labeled
  meter / ring / segmented gauge with the % and status inline — so it's clearly
  information, not a control. *Why:* users tried to "drag" it.
- **B6 · Stack the two age sliders on very narrow phones** (`grid-cols-1
  sm:grid-cols-2`) for a cleaner single column at 380px.

## v0.9 — "Depth" (later)

- **B3 · v6.1 features:** geography-aware lifestyle equivalence; school-board selector
  (ICSE/CBSE/IB + US public/private); RNOR flag with a one-line note. _(SPEC §6)_

## Later

- **B5 · 380px viewport e2e test** in CI (Playwright) to lock mobile usability. _(review)_
- **B2 · True LLM-written summary** (warmer prose) — needs a serverless function to hold
  the API key (never in front-end code). Decision: worth adding a backend dependency?
- **B4 · v7 features:** other-income slot (rental/pension, real vs nominal), USD/INR
  net-worth split (FX risk), LTCG withdrawal drag, sensitivity view. _(SPEC §6)_

## Done

- **B1 · Plain-English input summary** _(2026-05-29; `src/components/InputSummary.tsx`)_ —
  3–4 sentence recap of all inputs + the lowest "enough" with a one-line "why", under the
  headline. Reactive. On `develop`; ships to production with v0.7.
