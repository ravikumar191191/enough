# Backlog — Enough

A living, prioritized list of improvements. We work top-to-bottom within each
section. "Now" = building or next up; "Next" = soon; "Later" = good ideas not yet
scheduled; "Done" = shipped (newest first).

> A **backlog** is just the maintained to-do list for a product — the single place
> ideas land so nothing lives only in our heads or a chat thread. Each item has a
> short *what* and *why*. We re-rank it as priorities change.

---

## Now

_(nothing in flight)_

## Next

- **B2 · True LLM-written summary (optional upgrade).** The current "In plain English"
  blurb (B1) is generated deterministically from a template — instant, free, offline.
  A genuinely LLM-written version (warmer, more insightful prose) would need a small
  **serverless function** to hold the API key (a key can never live in front-end code —
  anyone could read it). Decision pending: is the extra polish worth introducing a
  backend dependency? *Why:* keeps the "AI" framing honest and could read better, but
  trades away the zero-backend simplicity.

## Later

- **B3 · v6.1 — geography-aware lifestyle equivalence + school-board selector**
  (ICSE/CBSE/IB, US public/private) + RNOR flag with a one-line note. _(from SPEC §6)_
- **B4 · v7 — other-income slot** (rental/pension, real vs nominal), USD/INR net-worth
  split for FX risk, LTCG withdrawal drag, sensitivity view. _(from SPEC §6)_
- **B5 · 380px viewport e2e test** in CI (e.g. Playwright) to lock mobile usability —
  closes the only unverified part of acceptance §9.6. _(from review)_
- **B6 · Make the two age sliders stack on very narrow phones** (`grid-cols-1
  sm:grid-cols-2`) for a cleaner single-column feel at 380px. _(from review, minor)_

## Done

- **B1 · Plain-English input summary.** A 3–4 sentence blurb under the headline that
  recaps every input (who you are, how you want to live, your assumptions) and ties it
  to the lowest "enough" with a one-line *why* — so the whole scenario is graspable
  without scrolling the controls. _(requested 2026-05-29; `src/components/InputSummary.tsx`)_
