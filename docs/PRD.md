# Enough — Product Requirements (Design Brief)

**Purpose of this doc:** a precise, self-contained brief an AI UX tool (Figma Make,
v0.dev, Lovable) — or a human designer — can turn into the *perfect* UX for Enough.
It captures the product, the users, the problems we solve, the screens, the design
system, and the roadmap. Rationale for every decision lives in
[PRD-rationale.md](./PRD-rationale.md).

**Read me first (constraints that shape the UX):** front-end-only, no backend, no
login, no stored data — **all state lives in the URL**. Mobile-first. Editorial/
broadsheet aesthetic. WCAG-AA. One screen, no routing. Currency: everything shown in
USD, with ₹ for India.

---

## Page 1 — Vision, scope & success

**One-liner.** *How much do you need to stop working — in every city you'd actually
live in? Enough ranks India and US cities by your personal "enough" number and shows
how close you are today.*

**Job-to-be-done.** "Given what we have and how we want to live, where can we afford to
stop working, and how far away is each option?"

**Who it's for.** A globally-mobile, Indian-origin tech/professional household (often
dual-income, 1–2 kids, mid-30s–40s, ~$1–5M net worth) weighing three doors: stay in a
high-cost US metro, move to a cheaper US metro, or return to India.

**The wedge (why we win).** Everyone else is US-only (FIRE blogs), logistics-only
(return-to-India sites), or stale spreadsheets. Enough is the only **current,
personalized, cross-border "enough number" with a stay-or-go ranking.**

**Positioning.** A trustworthy, beautiful, single-screen decision instrument — not a
financial planner, not a tax engine, not an immigration tool.

**Goal stance.** *Portfolio-first, but product-ready*: optimize to showcase craft, but
make choices that keep a real-product path open (good defaults, shareability, honesty).

**Success metrics (design must enable these).**
- **North-star:** completed scenarios *shared* per week (the share is the growth loop).
- **Activation:** % of sessions that reach a result **and** adjust ≥1 control.
- **Trust signal:** % of sessions that open an ⓘ or "Show the math" (trust-seeking).
- **Spread:** shares per session; preview-link click-throughs.
- *Instrumentation must be privacy-friendly & client-side (no PII, no accounts).*

**In scope:** the unified ranked calculator, all situation controls, per-geography
realism, transparency (show-the-math), Day/Night, shareable URL, share card.
**Non-goals:** full tax/filing engine, immigration/visa/logistics, investment advice,
accounts/profiles/server storage, multi-year RNOR modeling (flag only).

---

## Page 2 — The three users and their three problems each

> Personas in full: [personas.md](./personas.md). Each persona's **top three pains**
> are what the UX must resolve.

### P1 · Arjun — the Builder-Optimizer *(primary; ~the maker's own profile)*
Analytical, financially literate, weighing the move seriously.
1. **No trustworthy, personalized cross-border number** — existing tools are US-only or stale.
2. **Can't audit the assumptions** — a black box won't drive a life-sized decision.
3. **Can't model the real trade-offs** — FX risk, different earning power by country, sensitivity.

### P2 · Devang — the Settled Engineer *(reach)*
~11 yrs in engineering, busy, not a finance hobbyist, opens it on his phone.
1. **No fast gut-check** — tools demand too much setup for "could I even afford this?"
2. **Doesn't know what's affordable on his *actual* (country-specific) salary.**
3. **The decision is fuzzy** — nothing concrete he can share with spouse/friends.

### P3 · Meera — the Determined Returner *(reach)*
Already decided to return to India; emotionally motivated.
1. **Doesn't know *where in India* fits her means, or *how much* she needs.**
2. **No sense of readiness** — am I there yet, or how far off?
3. **The decision is ≥50% non-financial** (schools, air, family) — tools ignore it.

---

## Page 3 — The three problems WE solve (and why not the rest)

We deliberately solve **three** problems — the intersection of all three personas' top
pains and what's achievable front-end-only.

**Problem 1 — The missing number.**
*"There's no current, personalized cross-border 'enough' number."*
→ **Solve:** the calculator + sourced/dated model produces a per-city total tailored to
the user's situation. **Why:** it's the wedge; nothing else exists. Serves P1#1, P2#2, P3#1.

**Problem 2 — The one-glance stay-or-go comparison.**
*"I can't compare places apples-to-apples in one view."*
→ **Solve:** one unified ranked table (India + US) in USD, lowest tagged, with the *gap*
(funded % + years-to-fund). **Why:** the comparison *is* the decision. Serves all three.

**Problem 3 — Enough trust to act.**
*"I don't believe generic/stale numbers enough to act on them."*
→ **Solve:** transparency (per-row "show the math"), sourced + dated assumptions, honest
caveats near the answer, and per-geography fidelity (₹ salary for India, $ for US).
**Why:** without trust, no action and no share. Serves P1#2/#3, P2#1, P3#2.

**Why NOT these (explicitly out):**
- *Full tax/filing or immigration engine* — huge effort, low marginal trust gain;
  effective rates are "good enough" and honestly labeled.
- *Accounts / retention loops* — a calculator is inherently low-retention; we optimize
  for **one great share**, not return visits.
- *Heavy non-financial / QoL content* — would dilute focus; we serve P3's non-financial
  need *lightly* via inline flags (air quality, no-tax) rather than a separate product.

---

## Page 4 — Information architecture, screens & flows

**Single screen, no routing.** Vertical scroll on mobile; two columns on desktop
(controls left, results right). Top-to-bottom order = the narrative.

**Core flow:** land on a sensible default → see the answer immediately → adjust a few
controls → table re-ranks instantly → share the URL.

**Regions (top to bottom):**

1. **Header / explainer** — product name "Enough", a one-line value statement, and a
   one-line "how it works." Right side: Share, Reset, Day/Night.
2. **Headline answer (sticky)** — "Your lowest 'enough' is **{City} {$Total}**", plus
   **{funded %} funded today** and **{≈N yrs · funded by age X}**, each with a tappable
   ⓘ. Always reachable on scroll.
3. **Plain-English summary** — a 3–4 sentence recap of the whole scenario (who, how you
   want to live, assumptions) tying inputs → result → a one-line "why", + a directional/
   not-advice caveat. (Deterministic, not an LLM.)
4. **Controls ("Your situation")** — see below; supports **Quick** and **Advanced** modes.
5. **Ranked table ("lowest first")** — the focal element. Each row: rank, flag emoji,
   city + region, total (USD; ₹ echo for India), inline flags (AQI/no-tax), a clearly-
   labeled **"Funded today" meter** (NOT a slider), a quick breakdown, and an expandable
   **"Show the math"** ledger. Lowest row is tagged. **City filter:** India / US / Both.
6. **Footer** — caveats, sources with `LAST_UPDATED`, "built with Claude Code", not advice.

**Controls inventory** (each has a tappable ⓘ; ≥44px targets):
Buy/Rent · Home type (3BHK…Bungalow) · Segment (Mid/Premium/Luxury) · Lifestyle
(Comfortable/Affluent/Luxury, scales each city's *own* base) · Kids (0/1/2) · School
(India tier + US tier, each applies to its country) · Who works (Neither/One/Both) →
**per-geography salary** (₹/earner India, $/earner US) · Net worth (USD, ₹ echo) · Real
return · Withdrawal rate (SWR) · Current age / Plan-until · One-time move-in costs.

**Quick vs Advanced (new — design this).**
- **Quick (default for first-time / mobile):** show only the highest-impact controls
  (Buy/Rent, Home type, Lifestyle, Kids, Who-works+salary, Net worth) with smart
  defaults; everything else collapsed under an **"Advanced"** reveal.
- **Advanced:** the full control set (today's power-tool view).
- The mode itself should be encoded in the URL so a shared link preserves it.

**Key states to design:**
- Default / first-load (sensible numbers, answer already visible).
- "Already funded" (positive, green affirmation).
- "Out of reach at these inputs" (calm, non-alarming).
- Filtered to India-only / US-only.
- Show-the-math expanded.
- Day and Night themes.
- 380px narrow phone (one-handed, single column).

---

## Page 5 — Visual design system & interaction

**Mood:** editorial / broadsheet — like a beautifully typeset finance column, not a SaaS
dashboard. Calm, confident, trustworthy.

**Type.** Display & numerals: **Fraunces** (serif, optical sizing). Body: **Newsreader**
(serif). Tabular lining numerals for all figures so columns align. Scale roughly:
hero number 32–44px, city total 20–28px, body 15–16px, labels 11–13px uppercase tracked.

**Color tokens (carry these exactly).**
- *Paper (light):* bg `#f7f3ec`, panel `#fffdf8`, border `#e3dccb`, ink `#23201a`,
  muted `#6f685b`, accent `#9a3412` (burnt sienna).
- *Night (dark):* bg `#16140f`, panel `#211e17`, border `#3a352a`, ink `#f4efe4`,
  muted `#a59c88`, accent `#f59e6b`.
- Semantic: positive/funded = emerald; caution/flags = amber. All pairs must pass
  **WCAG-AA (4.5:1 text)** in *both* themes.

**Layout & spacing.** Generous whitespace, rounded-xl cards (12–16px), 16–24px gutters.
Max content width ~1024px on desktop; single column ≤640px.

**Signature components (design each, all states):**
- **Headline answer** — the emotional payload; big serif numeral in accent.
- **Funding meter** — a labeled *read-out* ("FUNDED TODAY 61% · ~8y to age 42") with a
  thin progress track. Must NOT look draggable (a key past confusion). Consider a
  ring/segmented gauge as an alternative — explore visually.
- **City row card** — identity + total + meter + breakdown + "Show the math" disclosure.
- **Show-the-math ledger** — a clean financial statement: spending lines → uncovered →
  corpus = uncovered ÷ SWR → upfront lines → buffer → **Total** (accent, bold).
- **Info tooltip (ⓘ)** — tappable, 44px hit area, keyboard + Escape, mobile-safe width.
- **Sliders / segmented controls** — 44px targets; sliders visually thin but easy to grab.
- **Flag chips** — AQI (amber), no-state-tax (emerald), Lowest (accent), each with ⓘ.
- **Share button → share card** (see Page 6).

**Interaction.** Instant re-rank on any change (no flicker, <16ms). Respect
`prefers-reduced-motion`. Day/Night auto-detects OS, toggle is session-only. Visible
focus rings on every interactive element.

**Accessibility.** Real `<label>`s; `aria-live` on the answer + ranked list; semantic
headings; ≥44px targets; AA contrast; fully keyboard-operable; usable one-handed at 380px.

---

## Page 6 — Roadmap, the share card & acceptance

**Shipped:** unified ranked model; comprehension pass (self-explaining header, headline
ⓘ, plain-English summary, "Funded today" labels); trust & fidelity (per-geography
salary, asking-price caveat near the answer, per-row show-the-math).

**Next to design (v0.9 "Reach & usability"):**
- **Quick/Advanced mode** (Page 4).
- **India / US / Both filter** on the ranked table.
- **Open-Graph share card** — *design this*: a 1200×630 image generated per scenario
  ("My enough number: **Hyderabad · $1.63M** — 61% funded, by age 42") in the editorial
  style, so every shared link is a billboard. (Needs a small serverless image step.)
- **Privacy-friendly analytics** to power the success metrics.
- **Funding-meter redesign** into an unmistakable gauge.

**Later:** geography-aware lifestyle equivalence; school-board selector (CBSE/IB); RNOR
flag; sensitivity view; other-income & USD/INR net-worth split (FX risk).

**Open decision (carry into design as a variant):** SWR — per-geography (India ≈2.5% /
US ≈3.5%) vs one global rate. Design the SWR control to accommodate either.

**Acceptance criteria for the UX.**
1. A first-time visitor understands what Enough does **from the first screen alone**.
2. The answer (lowest city, total, funded %, years) is visible without scrolling and
   stays reachable (sticky) on scroll.
3. Every number is explainable: ⓘ everywhere + a per-row "show the math".
4. Changing any control re-ranks all cities instantly with no flicker.
5. Quick mode reaches a credible answer in **≤3 interactions**; Advanced exposes everything.
6. The ranked meter reads as information, never as an input.
7. Both themes pass AA; fully usable one-handed at 380px.
8. Sharing yields a link (and OG card) that reproduces the exact scenario.
