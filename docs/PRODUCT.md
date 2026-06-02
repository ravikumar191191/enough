# FIREnough — Product & Customer Experience

*A 3-page product brief. What we're building, for whom, the problems we solve, the one
use case we must nail, and what winning looks like. Pairs with
[BUILD-SPEC.md](./BUILD-SPEC.md) (the 6-page engineering spec).*

---

## 1. The goal

**Help a globally-mobile household answer one heavy question — "where can we afford to
stop working?" — with a number they trust enough to act on, in under a minute, for
free, and shareable.**

Concretely: Enough ranks the cities a family would actually consider (India + US, in
one list, all in USD) by the total they'd need to stop working, and shows how close they
are today. The ambition is to become **the default link people paste** when this
question comes up in their community.

## 2. Who it's for — customer vs. user

These are not the same person, and the distinction drives the design.

- **The operator-user** — the financially-engaged partner (our primary persona
  "Arjun": ~30s–40s, Indian-origin, analytical, in a high-cost US metro). They open the
  app, tune the inputs, and want to *trust* the math. They are the hardest to win and
  the most valuable, because if they believe it, they share it into exactly the right
  network.
- **The recipient-user** — the *spouse, friend, or family WhatsApp group* who receives
  a shared link. They never touch a slider; they see a card and a result. **The share
  card is a first-class product surface designed for them**, not an afterthought.
- **The customer (the decision-making unit)** — the **household**. "Stop working" is a
  two-person decision; the product's job is to give a couple a shared, credible artifact
  to decide around. We design for the operator *and* the recipient because the customer
  is the pair.
- **The payer** — today, nobody: Enough is free and open-source. That's deliberate
  (distribution > revenue at this stage). A future payer, if any, is an adjacent party
  (a relocation service, a cross-border advisor) — explicitly out of scope for now, and
  noted so we never contort the free experience around hypothetical monetization.

## 3. The job and the three problems we solve

**Job-to-be-done:** *"Given what we have and how we want to live, where can we afford to
stop working — and how far away is each option?"*

Everything reduces to three problem buckets. They compound: a number is useless without
a comparison; a comparison is useless without trust.

| # | Problem | Our solution | How we fare |
|---|---|---|---|
| **1. The missing number** | No current, *personalized*, *cross-border* "enough" figure exists. Tools are US-only (FIRE blogs) or logistics-only (return-to-India sites). | A live model: per-city total tailored to the household's situation, sourced and dated. | **Strong / unique.** This is the wedge — nothing else does it. |
| **2. The incomparable comparison** | You can't weigh stay-vs-go across places apples-to-apples. | One unified ranked list (India + US) in USD, lowest tagged, with the *gap* (% funded today, years-to-fund) and per-geography realism (₹ vs $ salaries). | **Strong.** The unified table *is* the product; one glance answers stay-or-go. |
| **3. The trust gap** | Generic or stale numbers don't earn a life-sized decision. | Transparency ("show the math" on every city), sourced + dated assumptions, honesty placed *next to the answer*, per-country income. | **Strong & improving.** Solid today; deepening with sensitivity views and more sourced cities. |

**Deliberately not solved (scope discipline):** full tax/immigration/relocation
engines, financial planning, accounts. Each "no" protects the wedge — this category's
graveyard is tools that became everything and were trusted for nothing. We serve the
non-financial dimension (air quality, no-tax states) only as *light inline flags*.

## 4. The one use case to nail 100%

> **A dual-income, Indian-origin tech couple in a high-cost US metro wants to know — in
> one glance, on their phone — whether returning to India (and to which city) lets them
> stop working, and how far off they are.**

This is the wedge for four reasons:
1. **Highest intent.** It's the most acute, recurring, emotionally-charged question in
   this demographic.
2. **Tightest distribution.** This group lives in dense, trusting communities (WhatsApp
   groups, alumni networks, subreddits) — a shared card travels fast.
3. **Sharpest failure of incumbents.** Existing tools fail this exact question hardest.
4. **It exercises all three problems** — number, comparison, trust — so nailing it
   proves the whole product.

**The Minimal Lovable Product** is this flow, flawless: land → believable default →
India + US ranked with the India-return options surfaced → "how close are you" →
share a card worth forwarding. Lovable, not just minimal: the number must feel *real*
and the card must be *worth sending*. (We've built this; we're hardening trust and reach.)

**Why this opens the largest addressable TAM first.** The reachable core — Indian-origin
tech/professional households in the US actively weighing return — is on the order of a
few hundred thousand households (a subset of the ~2.8M Indian-born US residents, skewed
to high earners in the target net-worth band). Winning that slice earns the right to
expand along adjacent cross-border corridors (other US metros, other origin countries,
the broader "globally mobile high earner") — but only *after* the wedge is loved. Land
the corridor, then widen it.

## 5. Metrics — what we maximize, and what success means

**North-star: shared scenarios that get clicked.** Enough has no ads, no SEO moat, no
inherent retention (a calculator is used a handful of times per decision). The share
*is* the growth engine, so we optimize the share — and we measure it (cookieless, no
PII):

| Signal | Question it answers |
|---|---|
| Shares / session | Is the loop being fed? |
| Arrived-from-share visits | Did the card drive clicks? |
| Virality ratio (arrivals ÷ shares) | Is it compounding? |
| Activation (reached a result + tuned ≥1 control) | Did they engage? |
| Trust-seeking (opened an ⓘ or "show the math") | Did they believe it enough to inspect it? |

**Short-term success (weeks):** the loop demonstrably works — measurable shares,
arrivals-from-share > 0, low bounce, healthy trust-seeking — and target users say *"this
is the first one that felt real."*

**Long-term success (months+):** Enough is the **reflexive link** people paste when this
question arises in their community; growth is share-driven (virality ratio trending up);
coverage expands to more sourced corridors; and it's referenced as *the* trustworthy
cross-border "enough" tool.

**Guardrails (never trade away):** privacy (zero PII, no accounts), speed (instant
re-rank), accessibility (WCAG-AA, one-handed mobile), and honesty (caveats by the answer).

## 6. The experience we're committing to

Calm, editorial, and trustworthy — *a respected columnist's instrument, not a SaaS
dashboard or a spreadsheet.* A first-time visitor understands it in five seconds; the
answer is visible before any scrolling; the *why* sits right beneath it in plain
English; the controls are tunable without being overwhelming (Quick by default,
Advanced on demand); every number is auditable on tap; and one button turns the result
into a card worth forwarding. Free, private, fast, and honest — on the first screen, on
a phone, every time.
