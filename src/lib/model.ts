/**
 * model.ts — the calculation engine. Pure functions, no React.
 *
 * Formulas follow spec §5 exactly. Everything is computed in each city's LOCAL
 * currency, then converted to USD for the one unified ranked table. All money is
 * in real (today's) terms, so SWR and real-return are consistent.
 */

import {
  BUFFER_LOCAL,
  CITIES,
  FX,
  HOME_SIZE_SQFT,
  INDIA_CESS,
  INDIA_SCHOOL_LAKH,
  INDIA_STD_DEDUCTION,
  INDIA_SURCHARGE,
  INDIA_TAX_SLABS,
  LIFESTYLE_MULT,
  RENT_YIELD,
  US_CLOSING_COST_PCT,
  US_FEDERAL_SLABS,
  US_HEALTHCARE_USD,
  US_SCHOOL_USD,
  US_SEGMENT_SCALE,
  US_STD_DEDUCTION,
  homeTypeFactor,
  type Bracket,
  type CityData,
  type Flag,
  type HomeType,
  type IndiaSchool,
  type Lifestyle,
  type Segment,
  type Tenure,
  type USSchool,
  type Workers,
} from "../data/assumptions";

// ─────────────────────────────────────────────────────────────────────────────
// Inputs — the complete, serializable state of the calculator (spec §4).
// ─────────────────────────────────────────────────────────────────────────────

export interface Inputs {
  tenure: Tenure;
  homeType: HomeType;
  segment: Segment;
  lifestyle: Lifestyle;
  kids: 0 | 1 | 2;
  indiaSchool: IndiaSchool;
  usSchool: USSchool;
  workers: Workers;
  salaryUsdPerEarner: number; // gross $/earner, applied to US cities
  salaryInrPerEarner: number; // gross ₹/earner, applied to India cities
  netWorthUsd: number;
  realReturnPct: number;
  currentAge: number;
  planUntilAge: number;
  swrPct: number;
  setupUsd: number; // one-time setup, USD (converted to ₹ for India)
}

export const DEFAULT_INPUTS: Inputs = {
  tenure: "buy",
  homeType: "4bhk",
  segment: "premium",
  lifestyle: "affluent",
  kids: 1,
  indiaSchool: "premium",
  usSchool: "public",
  workers: 0,
  salaryUsdPerEarner: 150_000,
  salaryInrPerEarner: 6_000_000, // ₹60L — a senior India tech salary
  netWorthUsd: 1_000_000,
  realReturnPct: 7,
  currentAge: 34,
  planUntilAge: 95,
  swrPct: 3.5,
  setupUsd: 50_000,
};

// ─────────────────────────────────────────────────────────────────────────────
// A computed result per city. All headline figures in USD; India keeps an ₹ echo.
// ─────────────────────────────────────────────────────────────────────────────

export interface CityResult {
  city: CityData;
  homeUsd: number; // purchase price included in upfront (0 when renting)
  homeValueUsd: number; // notional home value (drives rent & property tax)
  annualSpendUsd: number;
  netIncomeUsd: number;
  uncoveredUsd: number;
  corpusUsd: number;
  upfrontUsd: number;
  bufferUsd: number;
  totalUsd: number;
  /** ₹ echo of TOTAL for India cities (null for US). */
  totalInr: number | null;
  fundedPct: number; // netWorth / total × 100
  yearsToFund: number; // 0 if already funded; Infinity if never
  fundedByAge: number | null; // currentAge + yearsToFund, null if never
  withinHorizon: boolean; // fundedByAge <= planUntilAge
  flags: Flag[];
  isLowest: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tax — effective-rate simplification, not a filing engine (spec §10).
// ─────────────────────────────────────────────────────────────────────────────

function progressiveTax(taxable: number, slabs: Bracket[]): number {
  let tax = 0;
  let prev = 0;
  for (const b of slabs) {
    if (taxable <= prev) break;
    const top = Math.min(taxable, b.upTo);
    tax += (top - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

function rateForIncome(income: number, table: Bracket[]): number {
  for (const b of table) if (income <= b.upTo) return b.rate;
  return table[table.length - 1].rate;
}

/** India new regime: slabs on (gross − std deduction), + surcharge, + 4% cess. */
export function afterTaxIndia(grossInr: number): number {
  if (grossInr <= 0) return 0;
  const taxable = Math.max(0, grossInr - INDIA_STD_DEDUCTION);
  const base = progressiveTax(taxable, INDIA_TAX_SLABS);
  const surcharge = base * rateForIncome(grossInr, INDIA_SURCHARGE);
  const total = (base + surcharge) * (1 + INDIA_CESS);
  return grossInr - total;
}

/** US: federal single-filer brackets on (gross − std deduction) + flat state on gross. */
export function afterTaxUS(grossUsd: number, stateRatePct: number): number {
  if (grossUsd <= 0) return 0;
  const taxable = Math.max(0, grossUsd - US_STD_DEDUCTION);
  const fed = progressiveTax(taxable, US_FEDERAL_SLABS);
  const state = grossUsd * (stateRatePct / 100);
  return grossUsd - fed - state;
}

// ─────────────────────────────────────────────────────────────────────────────
// Years-to-fund: smallest n where NW₀ grown at real return + annual savings ≥ TOTAL.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_FUND_YEARS = 200;

export function yearsToFund(
  netWorthUsd: number,
  totalUsd: number,
  realReturnPct: number,
  annualSavingsUsd: number
): number {
  if (netWorthUsd >= totalUsd) return 0;
  const r = realReturnPct / 100;
  let bal = netWorthUsd;
  for (let n = 1; n <= MAX_FUND_YEARS; n++) {
    bal = bal * (1 + r) + annualSavingsUsd;
    if (bal >= totalUsd) return n;
  }
  return Infinity;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-city computation
// ─────────────────────────────────────────────────────────────────────────────

export function computeCity(city: CityData, inp: Inputs): CityResult {
  const lifeMult = LIFESTYLE_MULT[inp.lifestyle];
  const swr = inp.swrPct / 100;
  const buying = inp.tenure === "buy";

  // Everything below is built in the city's local currency, then → USD.
  let homeValueLocal: number;
  let annualSpendLocal: number;
  let upfrontLocal: number;
  let netIncomeLocal: number;
  let bufferLocal: number;
  let toUsd: number; // divide local by this to get USD

  if (city.geography === "india") {
    toUsd = FX;
    const sqft = HOME_SIZE_SQFT[inp.homeType];
    homeValueLocal = sqft * city.rateCard[inp.segment]; // ₹

    const baseInr = city.baseLifestyleLakh * 1e5 * lifeMult;
    const schoolInr = inp.kids * INDIA_SCHOOL_LAKH[inp.indiaSchool] * 1e5;
    const rentInr = buying ? 0 : homeValueLocal * (RENT_YIELD.india / 100);
    annualSpendLocal = baseInr + schoolInr + rentInr;

    const setupInr = inp.setupUsd * FX;
    upfrontLocal = buying
      ? homeValueLocal + homeValueLocal * (city.stampDutyPct / 100) + setupInr
      : setupInr;

    netIncomeLocal = inp.workers * afterTaxIndia(inp.salaryInrPerEarner);
    bufferLocal = BUFFER_LOCAL.india;
  } else {
    toUsd = 1;
    homeValueLocal =
      city.homeAnchorUsd * US_SEGMENT_SCALE[inp.segment] * homeTypeFactor(inp.homeType);

    const baseUsd = city.baseLifestyleUsd * lifeMult;
    const schoolUsd = inp.kids * US_SCHOOL_USD[inp.usSchool];
    const healthcareUsd = US_HEALTHCARE_USD; // family, recurring
    const propTaxUsd = buying ? homeValueLocal * (city.propertyTaxPct / 100) : 0;
    const rentUsd = buying ? 0 : homeValueLocal * (RENT_YIELD.us / 100);
    annualSpendLocal = baseUsd + schoolUsd + healthcareUsd + propTaxUsd + rentUsd;

    upfrontLocal = buying
      ? homeValueLocal + homeValueLocal * (US_CLOSING_COST_PCT / 100) + inp.setupUsd
      : inp.setupUsd;

    netIncomeLocal = inp.workers * afterTaxUS(inp.salaryUsdPerEarner, city.stateTaxRatePct);
    bufferLocal = BUFFER_LOCAL.us;
  }

  const uncoveredLocal = Math.max(0, annualSpendLocal - netIncomeLocal);
  const corpusLocal = uncoveredLocal / swr;
  const totalLocal = upfrontLocal + corpusLocal + bufferLocal;

  // → USD for the unified table.
  const homeUsd = (buying ? homeValueLocal : 0) / toUsd;
  const homeValueUsd = homeValueLocal / toUsd;
  const annualSpendUsd = annualSpendLocal / toUsd;
  const netIncomeUsd = netIncomeLocal / toUsd;
  const uncoveredUsd = uncoveredLocal / toUsd;
  const corpusUsd = corpusLocal / toUsd;
  const upfrontUsd = upfrontLocal / toUsd;
  const bufferUsd = bufferLocal / toUsd;
  const totalUsd = totalLocal / toUsd;

  const annualSavingsUsd = Math.max(0, netIncomeUsd - annualSpendUsd);
  const years = yearsToFund(inp.netWorthUsd, totalUsd, inp.realReturnPct, annualSavingsUsd);
  const fundedByAge = Number.isFinite(years) ? inp.currentAge + years : null;
  const withinHorizon = fundedByAge !== null && fundedByAge <= inp.planUntilAge;

  return {
    city,
    homeUsd,
    homeValueUsd,
    annualSpendUsd,
    netIncomeUsd,
    uncoveredUsd,
    corpusUsd,
    upfrontUsd,
    bufferUsd,
    totalUsd,
    totalInr: city.geography === "india" ? totalLocal : null,
    fundedPct: totalUsd > 0 ? (inp.netWorthUsd / totalUsd) * 100 : 100,
    yearsToFund: years,
    fundedByAge,
    withinHorizon,
    flags: city.flags,
    isLowest: false,
  };
}

/** Compute every city and return them ranked by TOTAL (ascending). Lowest tagged. */
export function rankCities(inp: Inputs): CityResult[] {
  const results = CITIES.map((c) => computeCity(c, inp));
  results.sort((a, b) => a.totalUsd - b.totalUsd);
  if (results.length) results[0].isLowest = true;
  return results;
}
