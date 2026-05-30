/**
 * assumptions.ts — THE SINGLE SOURCE OF TRUTH.
 *
 * Every number the app displays derives from this file (spec §8, acceptance §9.2).
 * No magic numbers live in components. Change a value here and the whole UI
 * updates with no component edits.
 *
 * All figures are asking / midpoint estimates. Real transactions often close
 * 15–20% below asking (spec §5 sources, §10 caveats). Cross-currency comparison
 * is directional, not lifestyle-identical. Not financial advice.
 */

export const LAST_UPDATED = "May 2026";

/**
 * FX rate, ₹ per $1. Used to convert every India figure into USD for the unified
 * ranked table. Source: market rate, May 2026.
 */
export const FX = 95.7; // ₹/$

// ─────────────────────────────────────────────────────────────────────────────
// Shared enums
// ─────────────────────────────────────────────────────────────────────────────

export type Geography = "india" | "us";
export type Segment = "mid" | "premium" | "luxury";
export type HomeType = "3bhk" | "4bhk" | "5bhk" | "penthouse" | "bungalow";
export type Lifestyle = "comfortable" | "affluent" | "luxury";
export type Tenure = "buy" | "rent";
export type Workers = 0 | 1 | 2;

/** School tier ids span both geographies; only the relevant set is shown per city. */
export type IndiaSchool = "good" | "premium" | "elite";
export type USSchool = "public" | "private";
export type School = IndiaSchool | USSchool;

export interface Flag {
  kind: "warn" | "good";
  label: string; // short inline chip text
  detail: string; // shown in the ⓘ / tooltip
}

// ─────────────────────────────────────────────────────────────────────────────
// Home sizing & lifestyle multipliers (shared across geographies)
// ─────────────────────────────────────────────────────────────────────────────

/** Built-up area in sqft per home type (spec §5 India data). */
export const HOME_SIZE_SQFT: Record<HomeType, number> = {
  "3bhk": 1600,
  "4bhk": 2600,
  "5bhk": 3800,
  penthouse: 5500,
  bungalow: 5200,
};

/**
 * US homes are priced from a fixed anchor (a good-school-district 4BR family
 * home), scaled by home type *relative to the 4BHK baseline*. India prices come
 * straight from sqft × rate, so this factor only applies to the US anchor.
 */
export const US_BASELINE_HOME: HomeType = "4bhk";
export function homeTypeFactor(type: HomeType): number {
  return HOME_SIZE_SQFT[type] / HOME_SIZE_SQFT[US_BASELINE_HOME];
}

/** Lifestyle multiplier scales each city's OWN base spend (spec §5 "geography-aware"). */
export const LIFESTYLE_MULT: Record<Lifestyle, number> = {
  comfortable: 1.0,
  affluent: 1.3,
  luxury: 1.7,
};

/** US home segment scaling of the anchor price (spec §5 US data). */
export const US_SEGMENT_SCALE: Record<Segment, number> = {
  mid: 0.7,
  premium: 1.0,
  luxury: 1.6,
};

// ─────────────────────────────────────────────────────────────────────────────
// Schools
// ─────────────────────────────────────────────────────────────────────────────

/** India ICSE fees, ₹ lakh / yr / child (spec §5). v6.1 will add CBSE/IB tiers. */
export const INDIA_SCHOOL_LAKH: Record<IndiaSchool, number> = {
  good: 2.5,
  premium: 4.0,
  elite: 6.5,
};

/** US schooling, USD / yr / child. Public is $0 marginal (bundled into the home). */
export const US_SCHOOL_USD: Record<USSchool, number> = {
  public: 0,
  private: 35_000,
};

// ─────────────────────────────────────────────────────────────────────────────
// Recurring US cost drivers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Healthcare, USD / yr per family, pre-Medicare (ACA unsubsidized). Recurring, so
 * it grows the corpus. Drops at age 65 onto Medicare; we hold it flat for the
 * steady-state SWR sizing and surface the drop as an ⓘ note (spec §5, simplified).
 */
export const US_HEALTHCARE_USD = 28_000;
export const MEDICARE_AGE = 65;

/** Buyer closing costs, % of US home value. Not a spec line item; a documented
 *  standard estimate so the buy path has a transaction cost like India's stamp duty. */
export const US_CLOSING_COST_PCT = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// Rent yields, buffers (per geography)
// ─────────────────────────────────────────────────────────────────────────────

export const RENT_YIELD: Record<Geography, number> = {
  india: 3.0, // %/yr of home value (spec §5)
  us: 4.0,
};

/** Cash buffer added to TOTAL, in each geography's local currency (spec §5). */
export const BUFFER_LOCAL: Record<Geography, number> = {
  india: 40 * 1e5, // ₹40L
  us: 50_000, // $50k
};

// ─────────────────────────────────────────────────────────────────────────────
// Tax tables (effective-rate simplification, not a filing engine — spec §10)
// ─────────────────────────────────────────────────────────────────────────────

export interface Bracket {
  upTo: number; // upper bound of this bracket (local currency), Infinity for top
  rate: number;
}

/** India new regime, FY 2025-26 / AY 2026-27 (₹). Per earner. */
export const INDIA_TAX_SLABS: Bracket[] = [
  { upTo: 400_000, rate: 0.0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];
export const INDIA_STD_DEDUCTION = 75_000; // ₹, new regime salaried
export const INDIA_CESS = 0.04; // health & education cess on (tax + surcharge)
/** Surcharge on tax, by total-income threshold (new regime caps at 25%). */
export const INDIA_SURCHARGE: Bracket[] = [
  { upTo: 5_000_000, rate: 0.0 },
  { upTo: 10_000_000, rate: 0.1 },
  { upTo: 20_000_000, rate: 0.15 },
  { upTo: Infinity, rate: 0.25 },
];

/** US federal, single filer, 2025/26 (USD). Per earner. */
export const US_FEDERAL_SLABS: Bracket[] = [
  { upTo: 11_600, rate: 0.1 },
  { upTo: 47_150, rate: 0.12 },
  { upTo: 100_525, rate: 0.22 },
  { upTo: 191_950, rate: 0.24 },
  { upTo: 243_725, rate: 0.32 },
  { upTo: 609_350, rate: 0.35 },
  { upTo: Infinity, rate: 0.37 },
];
export const US_STD_DEDUCTION = 15_000; // USD, single 2025

// ─────────────────────────────────────────────────────────────────────────────
// Withdrawal & growth defaults
// ─────────────────────────────────────────────────────────────────────────────

/**
 * We apply ONE withdrawal rate to all cities so the comparison is apples-to-apples
 * (acceptance §9.3). India retirements are often modeled near 2.5% (longer
 * horizons), the US near 3.5% — surfaced as an ⓘ note. Default 3.5%.
 */
export const SWR_DEFAULT = 3.5; // %
export const SWR_MIN = 2.0;
export const SWR_MAX = 4.0;

export const REAL_RETURN_DEFAULT = 7.0; // %, real (spec §4)
export const REAL_RETURN_MIN = 4.0;
export const REAL_RETURN_MAX = 10.0;

// ─────────────────────────────────────────────────────────────────────────────
// Cities — the unified set. India + US live in ONE list (spec §3).
// ─────────────────────────────────────────────────────────────────────────────

interface BaseCity {
  id: string;
  name: string;
  region: string; // shown as a subtitle (e.g. "Telangana", "California")
  geography: Geography;
  flags: Flag[];
}

export interface IndiaCity extends BaseCity {
  geography: "india";
  rateCard: Record<Segment, number>; // ₹/sqft
  baseLifestyleLakh: number; // ₹L/yr, Comfortable
  stampDutyPct: number; // transaction cost on a purchase
}

export interface USCity extends BaseCity {
  geography: "us";
  homeAnchorUsd: number; // good-district 4BR family-home anchor
  baseLifestyleUsd: number; // USD/yr, Comfortable, owning, ex-healthcare, ex-property-tax
  propertyTaxPct: number; // %/yr of home value (recurring → annual spend)
  stateTaxRatePct: number; // top effective state income tax on salary
}

export type CityData = IndiaCity | USCity;

const AQI_FLAG: Flag = {
  kind: "warn",
  label: "Winter AQI",
  detail: "Gurgaon/NCR has poor air quality in winter months — a real quality-of-life cost not captured in the money model.",
};
const NO_STATE_TAX_FLAG: Flag = {
  kind: "good",
  label: "No state income tax",
  detail: "Washington levies no state income tax, so ongoing salary keeps more — a structural advantage over CA/NY metros.",
};

export const CITIES: CityData[] = [
  // ── India ───────────────────────────────────────────────────────────────
  // Rate cards (Mid / Premium / Luxury) and base lifestyle from v5 (spec §5).
  // Prices: 99acres / NoBroker / Square Yards, May 2026.
  {
    id: "HYD",
    name: "Hyderabad",
    region: "Telangana",
    geography: "india",
    rateCard: { mid: 8_000, premium: 11_500, luxury: 18_000 },
    baseLifestyleLakh: 28,
    stampDutyPct: 6.5,
    flags: [],
  },
  {
    id: "PUN",
    name: "Pune",
    region: "Maharashtra",
    geography: "india",
    rateCard: { mid: 9_000, premium: 14_000, luxury: 21_000 },
    baseLifestyleLakh: 29,
    stampDutyPct: 7.0,
    flags: [],
  },
  {
    id: "BLR",
    name: "Bengaluru",
    region: "Karnataka",
    geography: "india",
    rateCard: { mid: 8_000, premium: 14_000, luxury: 22_000 },
    baseLifestyleLakh: 33,
    stampDutyPct: 6.6,
    flags: [],
  },
  {
    id: "GGN",
    name: "Gurgaon",
    region: "Haryana (NCR)",
    geography: "india",
    rateCard: { mid: 10_000, premium: 22_000, luxury: 45_000 },
    baseLifestyleLakh: 35,
    stampDutyPct: 7.0,
    flags: [AQI_FLAG],
  },

  // ── United States ─────────────────────────────────────────────────────────
  // Home anchors = good-school-district family homes, above metro median.
  // Redfin / Zillow Feb–Apr 2026 medians, adjusted up for district quality.
  {
    id: "SEA",
    name: "Seattle",
    region: "Washington",
    geography: "us",
    homeAnchorUsd: 1_500_000,
    baseLifestyleUsd: 90_000,
    propertyTaxPct: 0.92,
    stateTaxRatePct: 0.0,
    flags: [NO_STATE_TAX_FLAG],
  },
  {
    id: "SF",
    name: "San Francisco",
    region: "California",
    geography: "us",
    homeAnchorUsd: 2_000_000,
    baseLifestyleUsd: 120_000,
    propertyTaxPct: 0.75,
    stateTaxRatePct: 13.0,
    flags: [],
  },
  {
    id: "SJC",
    name: "San Jose",
    region: "California",
    geography: "us",
    homeAnchorUsd: 2_200_000,
    baseLifestyleUsd: 120_000,
    propertyTaxPct: 0.75,
    stateTaxRatePct: 13.0,
    flags: [],
  },
  {
    id: "NYC",
    name: "New York",
    region: "New York",
    geography: "us",
    homeAnchorUsd: 1_800_000,
    baseLifestyleUsd: 130_000,
    propertyTaxPct: 1.9,
    stateTaxRatePct: 12.0,
    flags: [],
  },
  {
    id: "LA",
    name: "Los Angeles",
    region: "California",
    geography: "us",
    homeAnchorUsd: 1_800_000,
    baseLifestyleUsd: 110_000,
    propertyTaxPct: 0.75,
    stateTaxRatePct: 13.0,
    flags: [],
  },
  {
    // San Diego: median home ~$1.0M (Redfin/Zillow Feb–Apr 2026), adjusted up for
    // a good-district family home. CA property-tax & state income tax as elsewhere.
    id: "SD",
    name: "San Diego",
    region: "California",
    geography: "us",
    homeAnchorUsd: 1_400_000,
    baseLifestyleUsd: 105_000,
    propertyTaxPct: 0.75,
    stateTaxRatePct: 13.0,
    flags: [],
  },
];

/**
 * Sources (spec §5):
 * - India ₹/sqft & prices: 99acres / NoBroker / Square Yards, May 2026.
 * - US homes: Redfin / Zillow Feb–Apr 2026 medians (Seattle ~$865k, Bay Area
 *   ~$1.4M, San Jose ~$1.63M, SF ~$1.3M, NYC ~$800k, San Diego ~$1.0M), adjusted
 *   UP for good-district family homes.
 * - Property-tax & ACA healthcare: standard 2026 effective rates.
 * - Tax tables: India new regime FY25-26; US federal single-filer 2025/26.
 * All figures are asking/midpoint; transactions often close 15–20% lower.
 */
