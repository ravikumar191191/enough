# Enough ≈

**Your cross-border "enough" number — India and the US, ranked side by side in one list.**

A one-screen calculator for a globally mobile family weighing three doors: stay in
your high-cost US metro, move to a cheaper or no-tax US metro, or return to India.
It answers a single question: *given what we have and how we want to live, where can
we afford to stop working — and how far away is each option?*

Existing tools don't help. Return-to-India sites do logistics checklists; FIRE blogs
do US-only math; everyone else falls back on stale spreadsheets. **The gap is a
current, personalized, cross-border "enough number" with a stay-or-go ranking** — and
that's the whole product here.

> ⚠️ **Not financial advice.** Asking-side prices run high vs. actual transactions,
> cross-currency comparison is directional (not lifestyle-identical), and tax is
> simplified to effective rates. See [Caveats](#caveats).

**[▶ Live demo](https://enough-wheat.vercel.app/)** &nbsp;·&nbsp; [What's changed](CHANGELOG.md)
&nbsp;·&nbsp; Staging: every `develop` push & PR gets its own Vercel preview URL.

**Docs:** [Product brief (3-pager)](docs/PRODUCT.md) · [Build spec (6-pager)](docs/BUILD-SPEC.md)
· [Backlog](BACKLOG.md) · [Personas](docs/personas.md) · [Evaluation process](docs/evaluation-process.md)

<!-- Add screenshots here, e.g.:
![Light theme](docs/light.png)
![Dark theme](docs/dark.png)
-->

---

## What it does

- **One unified ranked table.** India and US cities sit in the *same* list, all in USD
  (with ₹ for India), so stay-or-go is one glance. Lowest is tagged; air-quality and
  no-income-tax flags show inline. **Filter** to India, US, or both.
- **Quick or Advanced.** Start with the essentials; switch to Advanced to tune segment,
  real return, withdrawal rate, age, and move-in costs.
- **Realistic income.** Separate salaries for India (₹) and the US ($), since the same
  person usually earns differently in each country.
- **Show the math.** Every city expands to the full derivation — spending, nest egg,
  upfront — so no number is a black box.
- **Live & shareable.** Change anything and the table re-ranks instantly. Every input is
  in the URL, so a copied link reproduces your exact scenario. No login, no backend.
- **Teachable & accessible.** A tappable ⓘ on every control; warm "paper" light theme and
  a high-contrast dark theme; keyboard-operable; works one-handed on a phone.

## The model

All money is computed in each city's **local currency**, then converted to USD at a
dated FX rate for the one ranked table. Everything is in real (today's) terms, so the
withdrawal rate and real return stay consistent.

```
home            = (Buy) purchase price for city × type × segment, else 0
annual_spend    = base_lifestyle[city] × lifestyle_mult
                  + kids × school_fee
                  + (US: healthcare + property_tax)   # recurring → grows the corpus
                  + (Rent: annual_rent)
net_income      = Σ over earners of after_tax(salary, geography)   # taxed where you LIVE
uncovered       = max(0, annual_spend − net_income)
invested_corpus = uncovered / SWR
upfront         = (Buy: home + transaction_cost + setup) or (Rent: setup)
TOTAL           = upfront + invested_corpus + buffer
years_to_fund   = smallest n where net-worth grown at real return + savings ≥ TOTAL
```

**Geography-aware lifestyle is the critical bit.** The lifestyle multiplier scales
each city's *own* base spending, so "Affluent" means locally-equivalent comfort —
**not** equal dollars. $2M in Bengaluru is not a $2M lifestyle in San Francisco, and
the model never pretends it is.

A few deliberate simplifications (it's a weekend MVP, not a filing engine):

- One salary figure (USD per earner) is converted to local currency per geography —
  real earning power differs by location.
- One withdrawal rate applies to every city so the comparison is apples-to-apples; an
  ⓘ note flags that India is often modeled near 2.5%, the US near 3.5%.
- US healthcare is held flat pre-Medicare in the steady-state corpus; the drop at 65
  is surfaced as a note, not modeled year-by-year.
- Tax uses effective brackets (India new regime FY25-26; US federal single-filer +
  flat state), not full filing logic. RNOR is out of scope for v6.

## Single source of truth

Every number the app displays comes from
[`src/data/assumptions.ts`](src/data/assumptions.ts) — every city, rate card, US cost
driver, tax table, FX rate, and a `LAST_UPDATED` constant, each with a source comment.
**No magic numbers in components.** Change a value there and the whole UI updates with
no component edits.

### Sources

| Data | Source | As of |
|---|---|---|
| India ₹/sqft & home prices | 99acres / NoBroker / Square Yards | May 2026 |
| US home medians (adjusted up for good-district family homes) | Redfin / Zillow | Feb–Apr 2026 |
| Property-tax & ACA healthcare | Standard 2026 effective rates | 2026 |
| India income tax | New regime, FY 2025-26 | 2026 |
| US income tax | Federal single-filer + flat state | 2025/26 |
| FX | 95.7 ₹/$ | May 2026 |

## Caveats

- **Asking ≠ transaction.** Listed prices run high; deals often close 15–20% lower.
- **Directional, not identical.** Cross-currency comparison reflects locally-equivalent
  comfort, not the same absolute dollars.
- **Simplified tax.** Effective rates, not a filing engine. No RNOR, no LTCG drag (yet).
- **Data goes stale.** The `LAST_UPDATED` date is shown in-app; FX and prices move.
- **Not financial advice.**

## Tech

Vite + React + TypeScript, TailwindCSS, lucide-react. No backend, no auth, no browser
storage — **all state lives in the URL query string**. Pure calculation engine in
[`src/lib/model.ts`](src/lib/model.ts) with a Vitest suite.

```bash
git clone https://github.com/ravikumar191191/enough.git
cd enough
npm install      # if your npm cache is root-owned: npm install --cache ./.npm-cache
npm run dev      # local dev server at http://localhost:5173
npm test         # run the model test suite
npm run build    # typecheck + production build → dist/
```

### Environments

| Branch | Environment | Who sees it |
|---|---|---|
| `main` | **Production** (live) | anyone with the link — share widely |
| `develop` | **Alpha / staging** | you + friends giving feedback on in-progress changes |

Connect the repo to [Vercel](https://vercel.com) (or Netlify / Cloudflare Pages) once:
`main` then auto-deploys to the production URL, and every push to `develop` (or any
pull request) gets its own preview URL — no manual deploy steps.

### Layout

```
src/
  data/assumptions.ts   # single source of truth — all numbers + sources
  lib/
    model.ts            # pure calculation engine (+ model.test.ts)
    format.ts           # USD / ₹ formatting
    urlState.ts         # encode/decode inputs ↔ URL
  hooks/
    useUrlState.ts      # state mirrored to the URL
    useTheme.ts         # Day/Night, OS-aware
  components/           # Header, Headline, Controls, RankedTable, Footer, ui
  App.tsx
SPEC.md                 # the build brief
.github/workflows/deploy.yml  # CI: typecheck + test + build + deploy to Pages
```

### Deploy

**Vercel** hosts it: `main` → production, every `develop` push / PR → its own preview
URL. CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) type-checks, tests, and
builds on every push and PR (deployment is Vercel's job — the standard "CI on GitHub, CD
on the host" split). Two small Vercel Edge functions power per-scenario share cards
([`api/og.tsx`](api/og.tsx), [`api/share.tsx`](api/share.tsx)).

## Built with Claude Code

This is a portfolio piece demonstrating **spec-driven, agentic building**: a single
[`SPEC.md`](SPEC.md) brief handed to [Claude Code](https://claude.com/claude-code),
which scaffolded the app, implemented the model with a test suite, verified it in a
live browser across both themes and mobile widths, and ran a multi-agent review pass
over the financial math before shipping.

## License

**[Apache License 2.0](LICENSE)** — free to use, modify, and distribute (including
commercially). Per the license, any redistribution or derivative must keep the
[`NOTICE`](NOTICE) file. A credit — *"Built on Enough by @ravikumar191191"* — is
appreciated wherever you build on it.

© 2026 Ravi Kumar ([@ravikumar191191](https://github.com/ravikumar191191)).
