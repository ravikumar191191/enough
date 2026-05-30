# Evaluation — Figma Make UX vs. our build

Date: 2026-05-30 · Method: opened both in a real browser, read full DOM text + screenshots.
- **Figma Make:** https://depth-drawn-02198259.figma.site/ (generated from our PRD)
- **Ours:** the `develop` build (v0.7 + v0.8)

## Verdict in one line
**Figma Make produced a gorgeous, faithful UX *shell* with a *broken brain*; we have
the correct, sourced, tested *brain* in a slightly less complete shell.** For a product
whose entire value is *trust in a number*, the brain is the product — so ours is the
real thing, and Figma's is the best possible mockup. The win is to **port Figma's UX
ideas onto our engine.**

## The decisive finding
In Figma's version, **all 13 cities show the identical total: "$50K · 100% funded
today"** — Bangalore $50K, San Francisco $50K, New York $50K, everything $50K. The
per-year cost lines *do* vary (SF housing $66K/yr vs Bangalore $9K/yr), so it has some
cost data — but the **"enough number" itself and the ranking are placeholder/broken.**
"Ranked by Total (Lowest First)" ranks nothing, because every total is tied. The core
job-to-be-done — *a real, differentiated number and a meaningful stay-or-go ranking* —
does not function.

Ours, same defaults: Hyderabad **$1,630,690** (61% funded), Pune **$1,743,739** (57%),
… up to US metros — real, differentiated, correctly ranked, and the "show the math"
reconciles to the dollar.

## Scorecard

| Dimension | Figma Make | Ours | Winner |
|---|---|---|---|
| First-impression clarity | Strong (used our copy) | Strong (v0.7) | ~Tie |
| Visual polish / aesthetic | Very good, faithful | Very good (Fraunces detail) | ~Tie |
| **Model correctness** | **Broken (all $50K)** | **Real, tested** | **Ours ✓✓** |
| **Trust / data integrity** | Generic + invented data | Sourced + dated | **Ours ✓✓** |
| Does it do the job (rank)? | No (fake ranking) | Yes | **Ours ✓✓** |
| Accessibility (AA, a11y) | Unverified / default | AA, aria-live, 44px, keyboard | **Ours ✓** |
| Engineering / shippable | Standalone, no tests | Single-source-of-truth, 15 tests, CI/CD, URL-state | **Ours ✓✓** |
| Quick / Advanced mode | **Built it** | Planned (v0.9) | **Figma ✓** |
| India / US / Both filter | **Built it** | Planned (v0.9) | **Figma ✓** |
| Precise value entry | Number inputs | Sliders only | **Figma ✓** (offer both) |
| City breadth | 13 cities | 9 cities | Figma (but unsourced) |

## What Figma did better — steal these
1. **Quick + Advanced progressive disclosure** — exactly our v0.9 plan, already shaped.
2. **India / US / Both filter** on the ranked list — also our v0.9 plan.
3. **Number-input fields** for salary/net worth — precise entry (P1). Best: sliders +
   an editable number, not either/or.
4. **Per-year cost breakdown** (Housing / Lifestyle / Kids / School) reads cleanly — a
   nice complement to our derivation ledger.
5. **More cities** as a *roadmap signal* (Chennai, Mumbai+Delhi w/ AQI, Austin/Miami/
   Denver/Boston) — but only after we *source* them.

## What's wrong with Figma's version (why it can't ship)
- **Core math is placeholder** — every total $50K, every city 100% funded. Fatal for
  the value prop.
- **Unsourced / invented data** — "Numbeo / various websites"; made-up cities and AQI
  numbers. Fails our Problem #3 (trust to act).
- **Bugs:** "$$1.00M" double-dollar typo; a ranking that doesn't rank.
- **Not integrated** — standalone Figma-hosted app; no single source of truth, tests,
  URL-state, or path into our repo/CI.

## The strategic lesson
AI UX generators are extraordinary at the **shell** (layout, copy, components, polish)
and unreliable at the **logic** (a correct, sourced model). For most CRUD apps the shell
is ~80% of the work; **for a trust instrument like Enough, the shell is the easy 20% and
the trustworthy model is the product.** Figma Make validated our PRD and surfaced two UX
features faster than we built them — perfect for *exploration*. It cannot be the source
of the shipped app.

## Recommendation
1. **Keep our engine.** It's the moat and it's correct.
2. **Adopt Figma's UX wins into our real model** — pull **Quick/Advanced** and the
   **India/US/Both filter** forward (they're already validated), and add an **editable
   number** next to each slider.
3. **Use Figma Make for exploration only**, never as the shipped artifact — exactly the
   "design in Figma, ship in-repo" path. This comparison *is* the proof of that rule.
4. **Backlog:** promote U1 (Quick/Advanced) and U2 (filter) into the next build now that
   we've seen them work; keep extra cities behind a "needs sourced data" gate.
