# Enough — PRD rationale (the "why" behind the brief)

A companion to [PRD.md](./PRD.md): why the brief says what it says, and what we
deliberately chose *not* to do. ~3 pages. If the PRD is the *what*, this is the *why* —
so a designer (or future-you) can make trade-offs in the same spirit.

---

## 1. Why these three users (and why P1 is primary)

We could have written for "anyone thinking about FIRE." We didn't, because a sharp
persona makes sharp design. The three are one cohort at three decision-stages:

- **P1 Builder-Optimizer — primary.** He's the hardest to win (analytical, skeptical)
  and the most valuable (if he trusts it, he shares it with exactly the right network).
  Designing for his trust bar lifts everyone. He also mirrors the maker, so empathy is
  cheap and accurate.
- **P2 Settled Engineer — reach.** Represents the *casual* majority who arrive via a
  shared link on mobile. He's why **time-to-value** and **Quick mode** exist.
- **P3 Determined Returner — reach.** Represents *intent already formed*; she's why the
  **India filter** and a **readiness** framing exist, and why we surface light QoL flags.

Designing only for P1 makes a power-tool nobody else finishes; only for P2 makes a toy
P1 won't trust. The UX must hold both — hence **Quick (P2/P3) over Advanced (P1)** as
progressive disclosure, not two products.

## 2. Why these three problems (and the discipline of stopping at three)

The three problems — *the missing number, the one-glance comparison, trust to act* —
are chosen because they (a) are the intersection of all three personas' top pains, (b)
compound (a number is useless without comparison; comparison is useless without trust),
and (c) are fully achievable **front-end-only**.

We explicitly **stop at three** to protect the wedge. The graveyard of this category is
tools that became everything (tax + immigration + community + planning) and so were
trusted for nothing. Each "no" on Page 3 is a focus decision:
- *No tax/immigration engine* — effort is enormous, trust gain is marginal once we're
  honest about effective rates. Honesty (caveats) buys more trust than precision here.
- *No accounts/retention* — calculators are inherently single-use; chasing retention
  would distort the design. We optimize the **one great share** instead (the OG card).
- *No heavy QoL content* — it's a different product; we honor P3's non-financial need
  with *light* inline flags, not a relocation guide.

## 3. Why front-end-only / URL-as-state (and what it forces)

No backend is a feature, not a limitation: free to host, instant, private, and
**every result is a shareable URL** — which doubles as our growth loop. It forces three
healthy constraints the designer should respect:
- **No secrets in the client** — so the "AI summary" is a *deterministic template*, not
  an LLM call (an LLM needs a serverless key-holder; tracked as a later option).
- **No saved profiles** — the URL *is* the save. So "Share" must capture 100% of state.
- **Analytics must be privacy-friendly & client-side** — no PII, no login walls.

## 4. Why the editorial / broadsheet aesthetic

Money decisions need *trust*, and trust reads as calm authority, not SaaS gradients.
Serif type (Fraunces/Newsreader), warm paper, restrained burnt-sienna accent, and
generous whitespace make the numbers feel considered and credible — which directly
serves Problem 3 (trust). It's also differentiated: every competitor looks like a
spreadsheet or a blog. The Day/Night pair must *both* clear AA so trust isn't
theme-dependent.

## 5. Key product decisions baked into the brief

- **Per-geography salary (₹ India / $ US).** The single biggest trust fix: a US salary
  converted to ₹ overstates Indian income and distorts the answer. Same person, different
  pay by country — now modeled. *Designed to appear only when someone is working*, so it
  never clutters the default view.
- **One global SWR today; per-geography is an open variant.** Global keeps the comparison
  apples-to-apples; per-geo (India ≈2.5% / US ≈3.5%) is more realistic. Design the SWR
  control to support either; decision pending.
- **Quick + Advanced, not two products.** Progressive disclosure resolves the P1↔P2
  tension without forking the experience.
- **The funding bar must read as a *read-out*, not a slider.** Real users tried to drag
  it. The meter needs a visual language distinct from our input sliders (label it, or
  switch to a ring/gauge).
- **Caveats sit *near the answer*, not just the footer.** Honesty up front is a trust
  multiplier for skeptical P1.
- **Show-the-math is core, not a power-user toy.** It's the mechanism that converts a
  number into a *believed* number.

## 6. Why this tooling path

Goal = the *perfect UX*, then *shipped in our stack*. So: explore visually where editing
is cheap (**Figma Make** consumes this PRD and yields an art-directable prototype +
design system), then implement into the real repo (**Claude Code / v0.dev**, both
React+Tailwind, same as production on Vercel). Avoid tools that produce a *separate* app
you can't fold back in — the design and the shipped code must converge, not diverge.

## 7. What we deliberately deferred (and why it's safe to)

Sensitivity view, FX-risk net-worth split, LTCG drag, school-board selector, RNOR — all
real, all *depth* features. They're deferred because **trust + reach** must come first:
a believed, shareable v1 earns the right to add depth. Building depth before trust is the
classic mistake of optimizing precision no one yet believes. Sequence: *understand → trust
→ spread → deepen.*

---

### How to use these two docs with an AI UX tool
1. Paste **PRD.md** Pages 1–5 as the primary prompt (vision → users → problems → IA →
   design system). Pages 4–5 are the most design-actionable.
2. Ask for the **default state first**, then the variants (already-funded, out-of-reach,
   India-filtered, show-the-math open, Night theme, 380px).
3. Feed **this rationale** when the tool (or a reviewer) asks "why" — it encodes the
   trade-offs so generated options stay on-strategy.
4. Bring the chosen direction back here; Claude Code implements it against the live model.
