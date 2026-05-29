# Enough — Spec

A one-screen calculator that answers a single question for a globally mobile family: **what's my "enough" number in every place I'd actually consider, India and the US, ranked side by side.** Build target: a static React web app, open-sourced on GitHub, hosted free, and used by anyone.

*Portfolio note: this is a weekend project demonstrating spec-driven, agentic building with Claude Code. The README should tell that story; this file is the build brief.*

---

## 1. Problem & who it's for

A dual-income, Indian-origin tech/professional couple in a high-cost US metro, 1–2 kids, high comp, liquid net worth roughly $1M–5M, mid-30s to 40s. They are weighing **three doors**: stay where they are, move to a cheaper or no-tax US metro, or return to India. Existing tools answer none of this well: return-to-India sites do logistics checklists; FIRE blogs do US-only numbers; everyone else falls back on stale Excel sheets and forum threads. **The gap is a current, personalized, cross-border "enough number" with a stay-or-go ranking.**

Primary job-to-be-done: *"Given what we have and how we want to live, where can we afford to stop working, and how far away is each option?"*

## 2. Goals / Non-goals

**Goals**
- One unified, live-updating table ranking India and US cities by total number needed, all shown in USD (with ₹ for India).
- Every cost number traceable to a sourced, dated assumption in one data file.
- Mobile-first, fast, no login, no backend. Inputs encoded in the URL so a result is shareable into a WhatsApp/Facebook group.
- Teachable: each control explains what it means and what it assumes.

**Non-goals (explicitly out of scope)**
- Full tax engine, immigration/visa logic, relocation logistics/checklists, investment advice.
- Multi-year RNOR tax modeling (surface as a flag only).
- Accounts, saved profiles, or any server-side storage.

## 3. Core experience

1. User lands on a sensible default and immediately sees the ranked table and a headline (the lowest option, their funding %, and years-to-fund).
2. They adjust a handful of controls (home type, segment, lifestyle, kids, who works, net worth, withdrawal rate, age).
3. The table re-ranks instantly across **all** India and US cities in one list. Lowest is tagged; air-quality and no-income-tax flags shown inline.
4. They hit "Share" and get a URL that reproduces their exact inputs.

The unified table is the product. India cities and US cities live in the **same single ranked list**, converted to a common currency, so the stay-or-go comparison is one glance.

## 4. Inputs (controls + defaults)

| Control | Options | Default |
|---|---|---|
| Buy or rent | Buy / Rent | Buy |
| Home type | 3 BHK, 4 BHK, 5 BHK, Penthouse, Bungalow (US: 3BR…6BR/house equivalent) | 4 BHK |
| Segment | Mid / Premium / Luxury | Premium |
| Lifestyle | Comfortable (1.0×) / Affluent (1.3×) / Luxury (1.7×) | Affluent |
| Kids | 0 / 1 / 2 | 1 |
| School | India: ICSE Good/Premium/Elite (v6.1: +CBSE/IB). US: Public/Private | India ICSE Premium; US Public |
| Who works | Neither / One / Both, + salary-per-earner slider (₹/$ gross) | Neither |
| Net worth today | USD slider (with ₹ readout) | $1.0M |
| Real return | 4–10% | 7% |
| Current age / Plan-until age | 25–55 / 80–100 | 34 / 95 |
| Withdrawal rate | 2.0–4.0% | 2.5% (India), 3.5% (US default note) |
| One-time setup | slider | ₹50L / $50k |

## 5. Model & formulas (the part that must be exact)

All money computed in local currency, then converted to USD for the unified table. `FX = 95.7 ₹/$` (in data file, dated).

```
home            = (Buy) purchase price for city × type × segment, else 0
annual_spend    = base_lifestyle[city] × lifestyle_mult
                  + kids × school_fee
                  + (US: healthcare + property_tax)        # recurring, so it grows the corpus
                  + (Rent: annual_rent)
net_income      = sum over earners of after_tax(salary, geography)   # taxed where you LIVE
uncovered       = max(0, annual_spend − net_income)
invested_corpus = uncovered / SWR
upfront         = (Buy: home + transaction_cost + setup) or (Rent: setup)
TOTAL           = upfront + invested_corpus + buffer
years_to_fund   = smallest n where NW₀ grows at real_return plus annual cashflow ≥ TOTAL
```

**Geography-aware lifestyle (critical):** the multiplier scales each city's *own* base, so "Affluent" means locally-equivalent comfort, not equal dollars. $2M in Bangalore is not a $2M lifestyle in SF; the model must not imply it is.

### India data (from v5, keep as-is)
- **Rate card ₹/sqft (Mid / Premium / Luxury):** HYD 8,000 / 11,500 / 18,000 · PUN 9,000 / 14,000 / 21,000 · BLR 8,000 / 14,000 / 22,000 · GGN 10,000 / 22,000 / 45,000. `home_cr = sqft × rate / 1e7`.
- **Sizes (built-up sqft):** 3BHK 1,600 · 4BHK 2,600 · 5BHK 3,800 · Penthouse 5,500 · Bungalow 5,200.
- **Base lifestyle ₹L/yr (Comfortable):** HYD 28 · PUN 29 · BLR 33 · GGN 35.
- **School ICSE ₹L/yr/child:** Good 2.5 · Premium 4.0 · Elite 6.5.
- **Stamp duty (transaction_cost %):** HYD 6.5 · PUN 7.0 · BLR 6.6 · GGN 7.0. **Rent yield** 3%/yr. **Buffer** ₹40L.
- **Tax:** new regime, per earner (slabs + surcharge >50L/1cr/2cr + 4% cess).
- **Flags:** Gurgaon = poor winter AQI.

### US data (new — good-school-district family homes, above metro median)
- **Home anchors (USD):** Seattle $1.5M · SF $2.0M · San Jose $2.2M · New York $1.8M · LA $1.8M. Segment scales these ±: Mid 0.7×, Premium 1.0×, Luxury 1.6×.
- **Base lifestyle USD/yr (Comfortable, owning, ex-healthcare, ex-property-tax):** Seattle 90k · SF 120k · San Jose 120k · NYC 130k · LA 110k. (Higher than India: no low-cost household help.)
- **Property tax (%/yr of home value):** Seattle 0.92 · SF 0.75 · San Jose 0.75 · NYC 1.9 · LA 0.75. (Recurring → in annual_spend.)
- **Healthcare:** flat $28k/yr per family pre-Medicare (ACA unsubsidized); drops after age 65.
- **State income tax (on ongoing salary, top effective):** WA 0% · CA ~13% (SF/San Jose/LA) · NY ~12% (incl. NYC). Federal applies in both US and (separately) India.
- **School:** Public $0 marginal (bundled in home), Private $35k/yr/child. **Rent yield** 4%/yr. **Buffer** $50k. **SWR** default note 3.5%.
- **Flags:** Washington = no state income tax (surface as a positive tag).

### Sources (put in data file, with `lastUpdated`)
India ₹/sqft and prices: 99acres / NoBroker / Square Yards, May 2026. US homes: Redfin / Zillow Feb–Apr 2026 medians, adjusted up for good-district family homes (Seattle median ~$865k, Bay Area ~$1.4M, San Jose ~$1.63M, SF ~$1.3M, NYC ~$800k). Property-tax and ACA figures: standard 2026 effective rates. **All figures are asking/midpoint estimates; transactions often close 15–20% lower.**

## 6. Scope by milestone

- **v6 (MVP / the weekend ship):** unified India+US ranked table in USD; all v5 India controls; US cost drivers (property tax, healthcare, state tax, no-help base); segment selector; Day/Night theme; info tags; net-worth gap + years-to-fund; buy/rent; age/horizon; **shareable URL state.**
- **v6.1:** geography-aware lifestyle equivalence; school-board selector (ICSE/CBSE/IB + US public/private); RNOR flag with a one-line note.
- **v7:** other-income slot (rental/pension, real vs nominal); USD/INR net-worth split (FX risk); LTCG withdrawal drag; sensitivity view.

## 7. UX & visual design

Carry the existing v5 aesthetic: editorial/broadsheet, serif display (Fraunces) for numbers, Newsreader for body, warm paper light theme + high-contrast dark theme with a Day/Night toggle that auto-detects OS appearance. Mobile-first (single column, ≥44px tap targets). Accessibility: WCAG-AA contrast, real labels, keyboard-operable controls. Every control has a tappable ⓘ explaining meaning + assumption. The ranked table is the focal element; keep the headline number always reachable (sticky on scroll is a plus).

## 8. Tech, repo, hosting

- **Stack:** Vite + React + TypeScript, TailwindCSS, lucide-react. Optional Recharts for a later sensitivity view. No backend, no auth, no browser storage; **all state in URL query params** (serialize/deserialize on load) for shareable links.
- **Single source of truth:** `src/data/assumptions.ts` holds every city, rate card, US driver, FX, and a `LAST_UPDATED` constant, each with a source comment. No magic numbers in components.
- **Repo layout:** `README.md` (portfolio story, screenshots, live link, "built with Claude Code"), `SPEC.md` (this), `src/` (App, components, hooks, data), `LICENSE` (MIT), CI workflow for auto-deploy.
- **Hosting:** Vercel or GitHub Pages (static). One-click deploy from the repo.

## 9. Acceptance criteria (definition of done)

1. Changing any control re-ranks all India + US cities in one table within ~16ms (no flicker).
2. Every displayed number derives from `assumptions.ts`; changing a data value updates the UI with no component edits.
3. The same withdrawal/return/age logic produces years-to-fund and funded-by-age for every city.
4. Buy vs Rent flips upfront-vs-corpus correctly; US property tax and healthcare appear in annual spend, not upfront.
5. "Share" produces a URL that, when opened fresh, reproduces the exact inputs and result.
6. Dark and light themes both pass AA contrast; usable one-handed on a 380px-wide phone.
7. README explains the model, lists sources with dates, and links a live demo.

## 10. Caveats to state in the UI/README

Asking-side prices run high vs transactions. Cross-currency comparison is directional, not lifestyle-identical. Tax handling is simplified (effective rates, not a filing engine). Prices and FX go stale; the `LAST_UPDATED` date is shown. Not financial advice.
