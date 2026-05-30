# Evaluation process — a self-improvement loop

How we pressure-test Enough every version and feed the results back into the
[backlog](../BACKLOG.md). Personas live in [personas.md](./personas.md).

## When it runs
On every new version, **on the preview (develop) before merging to `main`** — so issues
are caught in staging, not production.

## The loop

1. **Walk it cold — per user persona (P1, P2, P3).** Open the preview as that persona
   and judge it through their goals. Record findings in three buckets:
   - **Must improve** — blocks that persona's core job or trust.
   - **Could improve** — real upside, not blocking.
   - **Subjective → align** — a judgment call (scope, fidelity, direction) that needs
     Ravi's decision *before* we build. **We do not act on these until aligned.**
2. **Senior-PM / startup lens (L1).** Step back: wedge, moat, riskiest assumption,
   growth loop, retention, what to cut. Produce a direction recommendation to debate.
3. **Principal-PM lens (L2).** Score the *maker's* craft and name the specific moves to
   reach the next level.
4. **Synthesize → decide.** Align with Ravi on the subjective items and the direction,
   then translate confirmed items into prioritized backlog entries for the next version.
5. **Record it.** Save the run as `docs/evaluations/<date>-<version>.md` so we can see
   the product (and the maker) improve over time.

## Output contract (keep it skimmable)
Each persona section = a short table: **Finding · Bucket (Must/Could/Subjective) ·
Why it matters · Proposed action**. Lenses = a few bullets + one headline takeaway.

## The golden rule
**Align before building.** Subjective/direction calls are surfaced as questions and
wait for Ravi's answer. Personas inform; the PM decides.

## Where this is headed (automation)
Today this loop is run manually (by Claude, role-playing each persona against the
preview). It's deliberately structured so it can later become an **automated
persona-agent workflow**: one agent per persona, each given the persona brief + the
preview URL, returning findings as structured data we auto-file into the backlog —
"auto-test, then propose auto-improvements for human approval." That's the path from
*assisted* to *continuous* evaluation.
