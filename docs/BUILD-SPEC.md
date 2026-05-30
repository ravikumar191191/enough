# Enough — Build Spec

*The authoritative 6-page engineering specification. Detailed enough to build, ship,
test, and evaluate to first production usage. Pairs with [PRODUCT.md](./PRODUCT.md) (the
3-page product brief). Supersedes the original `SPEC.md` (the v6 origin brief) for
current state. Source of truth for all numbers is [`src/data/assumptions.ts`](../src/data/assumptions.ts).*

---

## Page 1 — Overview, principles, stack

**What it is.** A one-screen web app that ranks India + US cities by the total a
household needs to stop working ("enough"), all in USD (₹ echoed for India), and shows
how close they are today. Inputs describe the household's situation; the ranking
recomputes instantly; results are shareable by link with a rich preview card.

**Non-negotiable principles.**
1. **Front-end-first, minimal backend.** The app is a static SPA; *the only* server code
   is two tiny Vercel Edge functions for share cards. No database, no accounts, no
   server-side user state.
2. **The URL is the state.** Every input serializes to the query string; a link
   reproduces the exact scenario. No cookies, no localStorage for inputs.
3. **One source of truth.** Every displayed number derives from `assumptions.ts`.
   Changing a data value updates the UI with zero component edits.
4. **Privacy.** No PII, ever. Analytics are cookieless and event-only.
5. **Trust through transparency.** Every number is explainable (ⓘ + "show the math");
   assumptions are sourced and dated; caveats sit next to the answer.
6. **Mobile-first & accessible.** WCAG-AA in both themes; usable one-handed at 380px;
   keyboard-operable; instant (<16 ms) re-rank.

**Stack.** Vite + React 18 + TypeScript, TailwindCSS, lucide-react. Tests: Vitest.
Serverless: `@vercel/og` (edge). Analytics: `@vercel/analytics`. No other runtime deps.

**Hosting / CI-CD.** Vercel. `main` → production; every `develop` push & PR → a preview
URL. GitHub Actions ([`ci.yml`](../.github/workflows/ci.yml)) runs type-check + tests +
build on push/PR; Vercel does deployment ("CI on GitHub, CD on the host"). License:
Apache-2.0 + `NOTICE`.

---

## Page 2 — The financial model (must be exact)

All money is computed in each city's **local currency**, then converted to USD
(`toUsd` = `FX` for India, `1` for US). Everything is real (today's) terms.
`FX = 95.7 ₹/$` (dated, in data file).

```
home_value (local):
  India:  sqft[type] × rateCard[city][segment]                          # ₹
  US:     homeAnchor[city] × segmentScale[segment] × (sqft[type]/sqft[4BHK])   # $

annual_spend (local):
    base   = baseLifestyle[city] × lifestyleMult[lifestyle]
  + school = kids × schoolFee[tier]
  + (US only) healthcare(28k) + (buy ? home_value × propertyTax%[city] : 0)
  + (rent ? home_value × rentYield%[geo] : 0)

net_income (local):
  India:  workers × afterTaxIndia(salaryInrPerEarner)
  US:     workers × afterTaxUS(salaryUsdPerEarner, stateTax%[city])

uncovered = max(0, annual_spend − net_income)
corpus    = uncovered / SWR
upfront   = buy ? (home_value + transactionCost + setup) : setup
              transactionCost = India: home×stampDuty%[city] · US: home×1.0% (closing)
              setup           = India: setupUsd×FX · US: setupUsd
total     = upfront + corpus + buffer[geo]

# → USD: divide each by toUsd
funded%        = netWorthUsd / totalUsd × 100
annualSavings  = max(0, netIncomeUsd − annualSpendUsd)
years_to_fund  = smallest n where NW₀ compounding at realReturn + annualSavings ≥ totalUsd
                 (0 if already funded; ∞ if unreachable within 200 yrs)
funded_by_age  = currentAge + years_to_fund
```

**Geography-aware lifestyle (critical):** the multiplier scales each city's *own* base —
"Affluent" means locally-equivalent comfort, **not** equal dollars.

**Per-geography salary (critical for trust):** India cities use a ₹ salary; US cities use
a $ salary. Never convert one into the other — the same person earns differently by
country.

### Data (current values — verify against `assumptions.ts`)

**India** — rate card ₹/sqft (mid/premium/luxury) · base lifestyle ₹L/yr · stamp duty %:
- HYD 8,000 / 11,500 / 18,000 · 28 · 6.5
- PUN 9,000 / 14,000 / 21,000 · 29 · 7.0
- BLR 8,000 / 14,000 / 22,000 · 33 · 6.6
- GGN 10,000 / 22,000 / 45,000 · 35 · 7.0 · flag: poor winter AQI

**US** — home anchor $ · base lifestyle $/yr · property tax % · state income tax %:
- Seattle 1.5M · 90k · 0.92 · 0 (flag: no state income tax)
- San Diego 1.4M · 105k · 0.75 · 13
- Los Angeles 1.8M · 110k · 0.75 · 13
- San Francisco 2.0M · 120k · 0.75 · 13
- San Jose 2.2M · 120k · 0.75 · 13
- New York 1.8M · 130k · 1.9 · 12

**Shared:** home sizes (sqft) 3BHK 1600 / 4BHK 2600 / 5BHK 3800 / Penthouse 5500 /
Bungalow 5200 · US baseline = 4BHK · lifestyle ×1.0/1.3/1.7 · US segment ×0.7/1.0/1.6 ·
India school ₹L 2.5/4.0/6.5 · US school $0 / $35k · US healthcare $28k (pre-65) ·
US closing 1.0% · rent yield India 3% / US 4% · buffer India ₹40L / US $50k.

**Tax (effective-rate simplification, not a filing engine).**
- India new regime FY25-26 (₹): slabs 0/5/10/15/20/25/30% at 4/8/12/16/20/24L cutoffs;
  std deduction 75k; surcharge 0/10/15/25% above 50L/1cr/2cr; 4% cess on (tax+surcharge).
- US federal single 2025 ($): 10/12/22/24/32/35/37% at 11.6k/47.15k/100.5k/191.95k/
  243.7k/609.35k; std deduction 15k; flat state on gross.

**Defaults:** buy · 4BHK · premium · affluent · 1 kid · India ICSE Premium · US Public ·
nobody working · ₹60L & $150k salaries · $1.0M net worth · 7% real return · age 34 →
95 · 3.5% SWR · $50k move-in · Quick mode · filter Both.

**Sources (dated, in data file):** India ₹/sqft — 99acres/NoBroker/Square Yards (May
2026). US homes — Redfin/Zillow Feb–Apr 2026 medians, adjusted up for good-district
family homes. Property-tax/ACA — standard 2026 rates. *All figures asking/midpoint;
transactions often close 15–20% lower.*

---

## Page 3 — Architecture, files, state, serverless

```
src/
  data/assumptions.ts   # SINGLE SOURCE OF TRUTH: cities, rates, drivers, tax, FX, dates
  lib/
    model.ts            # pure engine: Inputs, computeCity, rankCities, tax, yearsToFund
    model.test.ts       # Vitest: tax, tenure, ranking, per-geo salary, URL round-trip
    format.ts           # usdFull / usdCompact / inrCompact / pct
    urlState.ts         # encode/decode Inputs ↔ query string (validated, clamped)
  hooks/
    useUrlState.ts      # state mirrored to URL (replaceState; popstate-aware)
    useTheme.ts         # Day/Night, OS-aware, session-only (no storage)
  components/
    Header · Headline · InputSummary · Controls · RankedTable · Footer · ui (primitives)
  App.tsx · main.tsx · index.css
api/
  og.tsx                # Edge: @vercel/og → 1200×630 per-scenario card image
  share.tsx             # Edge: per-scenario OG meta tags + redirect to app
vercel.json             # rewrite /share → /api/share
index.html              # default OG/Twitter tags
.github/workflows/ci.yml
```

**URL-state schema** (only non-defaults are written; unknown params ignored):
`t` tenure · `h` homeType · `sg` segment · `l` lifestyle · `k` kids · `is` indiaSchool ·
`us` usSchool · `w` workers · `sal` $salary · `sali` ₹salary · `nw` netWorth · `rr`
realReturn · `ca` currentAge · `pa` planUntil · `sw` swr · `su` setup · `adv` advanced ·
`f` filter. View flags (`adv`, `f`) live in `Inputs` but are ignored by the model.
`ref=share` is read once on load (→ `arrived_from_share` event) then stripped.

**Share / OG (the only backend).** Crawlers don't run JS, so a static SPA can't set
per-scenario preview tags. Therefore:
- `/api/og` (edge): renders the editorial card from display strings (`city`, `amount`,
  `line`). ASCII-safe text (no ₹/≈/· — avoids missing glyphs in the default font).
- `/share` → `/api/share` (edge, via rewrite): returns HTML whose `<head>` carries this
  scenario's OG/Twitter tags (`og:image` → `/api/og?...`) and redirects a human to
  `/?<inputs>&ref=share`. The Share button builds this link with the lowest city's
  display strings + the current input query.
- `index.html` carries default tags so non-shared links still unfurl to a branded card.

**Analytics.** `<Analytics/>` (cookieless) + `track('share')` on share + `track('arrived
_from_share')` on share-originated visits. (Enable Web Analytics in the Vercel dashboard.)

---

## Page 4 — UX specification

**Information architecture (one screen, no routing). Top → bottom = the narrative.**
1. **Header / explainer** — name "Enough", a plain value line, a one-line "how it works";
   right: Share, Reset, Day/Night.
2. **Headline answer (sticky, `aria-live`)** — *"Your lowest 'enough' is {City} {$Total}"*
   + *{funded%} funded today* + *{≈N yrs · funded by age X}*, each with a tappable ⓘ.
3. **Plain-English summary** — 3–4 deterministic sentences recapping the scenario →
   result → one-line "why", plus a directional/not-advice caveat. (Not an LLM call.)
4. **Controls ("Your situation")** — Quick/Advanced toggle, then:
   - *Quick:* Buy/Rent · Home type · Lifestyle · Kids (+School tiers) · Who works
     (+per-geo salaries) · Net worth.
   - *Advanced adds:* Segment · Real return · SWR · Current age / Plan-until · Move-in costs.
   - Money fields offer an editable number beside the slider.
5. **Ranked table** — filter (Both / India / US); each row: rank, flag, city + region,
   total (USD; ₹ for India), inline flags (AQI / no-tax / Lowest), a **labeled "Funded
   today" meter** (must read as a read-out, never a slider), a quick breakdown, and an
   expandable **"Show the math"** ledger (spend lines → uncovered → corpus = uncovered ÷
   SWR → upfront lines → buffer → total).
6. **Footer** — caveats, sources + `LAST_UPDATED`, license/credit.

**States to support:** default · already-funded (green) · out-of-reach (calm) ·
India-only / US-only · show-the-math open · Day & Night · 380px narrow phone.

**Design system.** Editorial/broadsheet. Display & numerals: **Fraunces**; body:
**Newsreader**; tabular lining figures. Tokens — *paper:* bg `#f7f3ec`, panel `#fffdf8`,
border `#e3dccb`, ink `#23201a`, muted `#6f685b`, accent `#9a3412`; *night:* bg `#16140f`,
panel `#211e17`, border `#3a352a`, ink `#f4efe4`, muted `#a59c88`, accent `#f59e6b`.
Positive = emerald, caution/flags = amber. Rounded-xl cards, generous whitespace,
max width ~1024px (single column ≤640px).

**Accessibility (hard requirements).** AA contrast in *both* themes (verified: accent on
paper 6.6:1, ink 14:1). Real `<label>`s; `aria-live` on the answer and the ranked list;
semantic headings; ≥44px tap targets (info icon expands its hit area; slider hit area is
44px tall with a thin visible track); visible focus rings; full keyboard operation;
respects `prefers-reduced-motion`; one-handed at 380px.

---

## Page 5 — Build, ship, test

**Setup.**
```bash
git clone https://github.com/ravikumar191191/firenough.git && cd enough
npm install          # if the npm cache is root-owned: npm install --cache ./.npm-cache
npm run dev          # http://localhost:5173  (edge functions do NOT run here)
```

**Quality gates (all must pass before merge — enforced by CI).**
```bash
npm run typecheck    # tsc --noEmit (strict)
npm test             # Vitest: model + URL round-trip (≥15 tests)
npm run build        # tsc --noEmit && vite build
```

**Test coverage required (in `model.test.ts`):** tax monotonic & bounded; WA(0%) keeps
more than CA(13%); years-to-fund 0-when-funded / finite-with-positive-return / faster-
with-savings; buy puts home in upfront, rent doesn't; US property-tax & healthcare in
annual spend (not upfront); ranking sorted ascending with exactly one lowest; **salary
applied per geography** (₹ moves India only, $ moves US only); URL encode→decode is
identity, defaults → empty query, garbage clamped/ignored.

**Branch & ship flow.** Build on `develop` → push → review the Vercel preview → open a
PR (`develop`→`main`) → CI green → merge → Vercel auto-deploys production. Edge functions
**must be verified on a preview deploy** (they can't run locally):
- Open `/<preview>/api/og?city=Hyderabad&amount=%241%2C630%2C690&line=...` → a card image.
- Open `/<preview>/share?...&to=%3Ft%3Drent` → redirects to the app with those inputs.
- Validate a shared link at opengraph.xyz (correct title/description/image).

---

## Page 6 — Acceptance, evaluation, metrics, roadmap

**Definition of done (production-ready).**
1. A first-time visitor understands what Enough does from the first screen alone.
2. The answer (lowest city, total, % funded, years) is visible without scrolling and
   stays reachable (sticky) on scroll.
3. Every number is explainable: ⓘ everywhere + per-row "show the math" that reconciles
   to the total exactly.
4. Changing any control re-ranks all cities instantly (<16 ms, no flicker).
5. Every displayed number derives from `assumptions.ts`; a data change needs no component
   edits.
6. Buy↔Rent flips upfront vs corpus; US property tax + healthcare are in annual spend,
   not upfront; salary is per geography.
7. Quick mode reaches a credible answer in ≤3 interactions; Advanced exposes everything;
   filter recomputes the headline within the visible set.
8. Sharing yields a link + card that reproduces the exact scenario; the OG image endpoint
   is fast and error-free.
9. Both themes pass AA; fully usable one-handed at 380px; keyboard-operable.
10. CI green (type-check + tests + build); deployed to production on Vercel.

**Evaluation loop (per release, on the preview before merge).** Walk the app as each of
three personas (Builder-Optimizer, Settled Engineer, Determined Returner) and two lenses
(senior-PM/startup, principal-PM); bucket findings Must / Could / Subjective-needs-align;
align before building; record in `docs/evaluations/`. See
[evaluation-process.md](./evaluation-process.md) and [personas.md](./personas.md).

**Metrics & instrumentation.** North-star = shared scenarios that get clicked. Events:
`share`, `arrived_from_share`; derived: virality ratio (arrivals ÷ shares), activation
(result + ≥1 control change), trust-seeking (ⓘ / show-the-math opens). All cookieless,
no PII. Short-term success = the loop measurably works; long-term = Enough is the
reflexive link people paste. Guardrails: privacy, speed, AA, honesty.

**Known gaps & roadmap (prioritized).**
- *Reach:* more **sourced** cities — no-tax US door (Austin TX, Miami FL), India breadth
  (Chennai). Never add a city without dated source data.
- *Trust depth:* a sensitivity view (FX/price ±15%); the per-geography-SWR decision
  (India ≈2.5% vs US ≈3.5% vs one global rate); RNOR flag.
- *Polish:* load Fraunces into the OG image to match the site's serif; redesign the
  funding meter into a gauge; a 380px e2e test in CI.
- *Later:* other-income slot (rental/pension), USD/INR net-worth split (FX risk), LTCG
  drag, an optional LLM-written summary (needs the existing serverless layer).
