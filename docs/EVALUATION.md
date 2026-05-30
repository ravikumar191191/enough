# How we evaluate Enough — a field guide (L100 → L300)

*Written for someone doing this for the first time, especially in the AI-assisted ("vibe
coding") world. It explains every way we check that this product is correct and good —
ranked most-important to least — what each layer catches, and crucially what it misses.*

---

## Why this matters more in the vibe-coding era (the L100 idea)

When you write every line yourself, you carry a mental model of why each part works. When
an **AI writes the code**, you get a lot of plausible-looking output *fast* — and AI is
confidently wrong in a specific, dangerous way: it produces code that **looks right,
compiles, and is subtly incorrect** (a flipped sign in a formula, a wrong default, a
plausible-but-fake number). The Figma version of this app is the perfect cautionary tale:
beautiful UI, every city showing the same fake `$50K`.

So the bottleneck shifts. **Writing code is cheap; *trusting* it is the hard part.**
Evaluation — the discipline of verifying what was built — is the skill that separates a
vibe-coded toy from a shippable product. This doc is our evaluation stack.

**The mental model: layered defense ("Swiss cheese").** No single check catches
everything. Each layer is a slice of cheese with holes; stack enough slices and the holes
stop lining up. You don't pick *one* way to test — you layer cheap-and-broad checks under
expensive-and-deep ones.

```
fastest / cheapest / catches dumb errors
  │  1. Unit tests (is the logic correct?)
  │  2. Type-check (do the shapes line up?)
  │  3. Build (does it compile to something shippable?)
  │  4. CI (are 1–3 enforced automatically, every time?)
  │  5. Live verification (does it actually work in a browser?)
  │  6. Adversarial AI review (what did we miss?)
  │  7. Human / persona evaluation (does it work for real people?)
  ▼  8. Production metrics (is it succeeding in the wild?)
slowest / most expensive / catches "we built the wrong thing"
```

---

## The layers, most important first

### 1. Unit tests — *is the core logic correct?* 🥇

**What it is.** Small, automated checks that run a function and assert the answer. Ours
live in [`src/lib/model.test.ts`](../src/lib/model.test.ts) and run with **Vitest**
(`npm test`). 15 tests today.

**Why it's #1 here.** Enough's entire value is *a correct number*. A wrong formula is the
scariest failure because it's **invisible** — the app looks fine and lies. Tests pin the
math down. Examples of what ours assert:
- tax is monotonic and never exceeds income; Washington (0% state) keeps more than CA (13%);
- `years-to-fund` is 0 when already funded, finite with positive returns, and faster with savings;
- **buy** puts the home in *upfront*; **rent** doesn't; US property-tax & healthcare land in *annual spend*, not upfront;
- salary is applied **per geography** (₹ moves India only, $ moves US only);
- the ranking is sorted with exactly one "lowest"; the sensitivity range brackets the point estimate;
- the URL round-trips exactly (encode→decode is identity) and clamps/ignores garbage.

**What it catches:** logic/math regressions — the moment someone (or an AI) changes a
formula and breaks it, a test goes red.
**What it MISSES:** anything visual, anything about whether the *data* is right (a test
confirms the formula; it can't tell you ₹/sqft for Pune is wrong), and whether users
understand it. A green test suite ≠ a good product.

**Vibe-coding angle:** this is your single best defense against confidently-wrong AI math.
A good habit: when the AI writes a tricky function, have it (or you) also write the test
that proves it — and read the test, because a wrong function plus a matching wrong test is
the trap.

### 2. Type-checking — *do the pieces fit?* 🥈

**What it is.** TypeScript (`npm run typecheck` → `tsc --noEmit`) verifies that values have
the shapes they claim — you can't pass a string where a number is expected, access a field
that doesn't exist, or forget a case. We run **strict** mode + `noUnusedLocals` /
`noUnusedParameters`.

**What it catches:** a huge class of "dumb" errors instantly, *before the code runs* — the
typos and wrong-shape mistakes AI makes constantly when stitching code together.
**What it MISSES:** logic. `corpus = uncovered * SWR` (should be ÷) type-checks perfectly
and is dead wrong — that's what layer 1 is for.

**Vibe-coding angle:** types are guardrails that make AI edits *safe to accept* — rename a
field and every stale reference lights up red immediately. It's the cheapest, fastest
feedback you have; run it constantly.

### 3. Build — *does it actually compile and bundle?* 🥉

**What it is.** `npm run build` (type-check + `vite build`) produces the real, optimized
files you'd ship. It catches problems that only appear in a production bundle (a bad
import, something that works in dev but not in the build).

**What it catches:** "works on my machine but won't deploy" failures.
**What it MISSES:** everything about whether the built thing is *correct* or *good* — it
only proves it's shippable.

### 4. CI — *are layers 1–3 enforced, automatically, every time?* 

**What it is.** **Continuous Integration**: a robot (GitHub Actions,
[`ci.yml`](../.github/workflows/ci.yml)) that runs type-check + tests + build on **every
push and pull request**. Red ✗ blocks the merge.

**Why it's a layer of its own.** Humans forget to run checks. CI makes the first three
*non-optional* — broken code literally cannot reach production through the front door. It's
the force-multiplier that turns "we have tests" into "tests actually protect us."
**What it MISSES:** only runs what you tell it to; it's exactly as good as layers 1–3.

**Lingo:** **CI** (test on every change) vs **CD** (deploy automatically). We do CI on
GitHub, CD on Vercel — the standard split.

### 5. Live verification — *does it actually work in a browser?*

**What it is.** Running the real app and *looking* — preview deploys (every branch gets a
Vercel preview URL), screenshots, clicking through the flows, and tools like the
**OpenGraph validator** for the share card. Half of what we did this whole project was
"build it → open the preview → screenshot → check it with my own eyes."

**What it catches:** everything static checks can't *see* — broken layout, a control that
doesn't respond, the share card not rendering, a number that's right in the test but
displayed unformatted (e.g. `1000000` instead of `$1,000,000`). Also: serverless functions
that **can't even run locally** (our OG functions only exist on Vercel — so they *must* be
verified on a preview).
**What it MISSES:** it's manual and sampled — you check the cases you think to check.

**Vibe-coding angle:** the AI literally cannot see the screen. Live verification is where
*you* are irreplaceable. Never trust "it should work" — open it and look.

### 6. Adversarial AI review — *what did the builder miss?*

**What it is.** A *second* set of eyes — here, AI agents — whose job is to **find what's
wrong**, not to agree. We ran a multi-agent review workflow over this codebase: ~6
dimensions (model correctness, data fidelity, tax accuracy, acceptance criteria,
accessibility, URL state), each finding then **independently verified** by a skeptic agent
(45 agents total). It caught real issues — *and* one verifier was itself wrong about a
contrast ratio, which is the whole point: even reviewers need reviewing.

**What it catches:** subtle correctness, security, and consistency issues the author (or
the first AI) is blind to — because the author shares the blind spot that created the bug.
**What it MISSES:** judgment calls and "is this the right product?" — and it can be
confidently wrong too, so findings need verification (we default reviewers to "try to
*refute* this").

**Vibe-coding angle:** the AI that *wrote* the code is the worst judge of it. A separate,
adversarial pass (a different model, a fresh agent, or just `/code-review`) is one of the
highest-leverage habits in AI-assisted building.

### 7. Human / persona evaluation — *does it work for real people?*

**What it is.** Structured usability assessment against our three
[personas](./personas.md), following [evaluation-process.md](./evaluation-process.md), with
findings recorded in [`docs/evaluations/`](./evaluations/). It's qualitative: walk the app
as Arjun / Devang / Meera and ask "where do they get confused, distrustful, or bored?"

**What it catches:** comprehension, trust, relevance, emotion — things no automated test
has an opinion about. This is how we found the #1 issue (the first screen didn't feel
personal → the stay-or-go delta).
**What it MISSES:** it's a *proxy* until you test with **real** users. Personas are
educated guesses; real humans surprise you.

**Vibe-coding angle:** AI can role-play personas usefully (we did), but the gold standard
remains putting it in front of actual target users. Proxy first, real soon.

### 8. Production metrics — *is it actually succeeding?*

**What it is.** Measuring real behavior in the wild — cookieless analytics + custom events
(`share`, `arrived_from_share`) tied to our north-star (shared scenarios that get clicked).

**What it catches:** the ultimate failure — *we built the wrong thing.* Everything above
can be green while nobody shares it. Metrics are the only layer that tells the truth about
value.
**What it MISSES:** the *why*. Numbers say "engagement dropped," not "because the default
felt irrelevant" — you go back to layer 7 for that.

---

## A special case worth naming: benchmark / competitive eval

Comparing your build against an alternative is its own kind of evaluation. We did it once —
[Figma Make vs. our build](./evaluations/2026-05-30-figma-vs-ours.md) — and it sharpened
exactly *what* our moat is (a correct model vs. a pretty shell). Use it when you want to
know not "is this correct?" but "is this *better*, and at what?"

---

## The L300 takeaway

1. **No single layer is enough.** Tests miss data errors; types miss logic; CI misses UX;
   metrics miss the why. Stack them.
2. **Cheap-and-broad before expensive-and-deep.** Run type-check constantly, tests on every
   change, CI on every push; reserve human and production eval for when the cheap layers
   are green.
3. **In AI-assisted building, verification *is* the job.** The model writes plausible code
   in seconds; your value is knowing whether to trust it. The evaluation stack is how you
   move fast *without* shipping confident nonsense.
4. **Even evaluators are fallible** — verify findings, use a second adversarial pass, and
   keep a human (you) in the loop where it counts: looking at the real thing, and deciding
   what "good" means.

## Day-to-day cheat sheet

```bash
npm run typecheck   # constantly — instant, catches shape errors
npm test            # after any logic change — proves the math
npm run build       # before shipping — proves it bundles
# push → CI runs all three automatically and blocks a red merge
# open the Vercel preview → look at it, click it, validate the share card
# then: adversarial review (/code-review) → persona pass → ship → watch analytics
```

**The loop, in one line:** *type-check while you build → test the logic → build → let CI
gate it → look at the live preview → have a skeptic review it → judge it as your users
would → ship → measure.*
