/**
 * urlState.ts — serialize/deserialize the full Inputs to/from URL query params.
 *
 * All state lives in the URL (spec §8): no backend, no storage. A shared link
 * reproduces the exact inputs and result (acceptance §9.5). Only values that
 * differ from the defaults are written, so links stay short; anything missing
 * falls back to the default on parse.
 */

import {
  REAL_RETURN_MAX,
  REAL_RETURN_MIN,
  SWR_MAX,
  SWR_MIN,
  type HomeType,
  type IndiaSchool,
  type Lifestyle,
  type Segment,
  type Tenure,
  type USSchool,
} from "../data/assumptions";
import { DEFAULT_INPUTS, type Inputs } from "./model";

const KEY: Record<keyof Inputs, string> = {
  tenure: "t",
  homeType: "h",
  segment: "sg",
  lifestyle: "l",
  kids: "k",
  indiaSchool: "is",
  usSchool: "us",
  workers: "w",
  salaryUsdPerEarner: "sal",
  salaryInrPerEarner: "sali",
  netWorthUsd: "nw",
  realReturnPct: "rr",
  currentAge: "ca",
  planUntilAge: "pa",
  swrPct: "sw",
  setupUsd: "su",
};

const TENURES: Tenure[] = ["buy", "rent"];
const HOME_TYPES: HomeType[] = ["3bhk", "4bhk", "5bhk", "penthouse", "bungalow"];
const SEGMENTS: Segment[] = ["mid", "premium", "luxury"];
const LIFESTYLES: Lifestyle[] = ["comfortable", "affluent", "luxury"];
const INDIA_SCHOOLS: IndiaSchool[] = ["good", "premium", "elite"];
const US_SCHOOLS: USSchool[] = ["public", "private"];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const oneOf = <T extends string>(v: string | null, allowed: T[], dflt: T): T =>
  v !== null && (allowed as string[]).includes(v) ? (v as T) : dflt;

/** Inputs → "?t=rent&k=2..." (only non-defaults). */
export function encodeInputs(inp: Inputs): string {
  const p = new URLSearchParams();
  (Object.keys(KEY) as (keyof Inputs)[]).forEach((k) => {
    if (inp[k] !== DEFAULT_INPUTS[k]) p.set(KEY[k], String(inp[k]));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** URLSearchParams → fully-validated Inputs (missing/invalid → default). */
export function decodeInputs(search: string): Inputs {
  const p = new URLSearchParams(search);
  const d = DEFAULT_INPUTS;
  const num = (key: string, dflt: number) => {
    const raw = p.get(key);
    if (raw === null) return dflt;
    const n = Number(raw);
    return Number.isFinite(n) ? n : dflt;
  };
  const intIn = <T extends number>(key: string, allowed: T[], dflt: T): T => {
    const n = num(key, dflt);
    return (allowed as number[]).includes(n) ? (n as T) : dflt;
  };

  return {
    tenure: oneOf(p.get(KEY.tenure), TENURES, d.tenure),
    homeType: oneOf(p.get(KEY.homeType), HOME_TYPES, d.homeType),
    segment: oneOf(p.get(KEY.segment), SEGMENTS, d.segment),
    lifestyle: oneOf(p.get(KEY.lifestyle), LIFESTYLES, d.lifestyle),
    kids: intIn(KEY.kids, [0, 1, 2], d.kids),
    indiaSchool: oneOf(p.get(KEY.indiaSchool), INDIA_SCHOOLS, d.indiaSchool),
    usSchool: oneOf(p.get(KEY.usSchool), US_SCHOOLS, d.usSchool),
    workers: intIn(KEY.workers, [0, 1, 2], d.workers),
    salaryUsdPerEarner: clamp(num(KEY.salaryUsdPerEarner, d.salaryUsdPerEarner), 0, 2_000_000),
    salaryInrPerEarner: clamp(num(KEY.salaryInrPerEarner, d.salaryInrPerEarner), 0, 100_000_000),
    netWorthUsd: clamp(num(KEY.netWorthUsd, d.netWorthUsd), 0, 20_000_000),
    realReturnPct: clamp(num(KEY.realReturnPct, d.realReturnPct), REAL_RETURN_MIN, REAL_RETURN_MAX),
    currentAge: clamp(num(KEY.currentAge, d.currentAge), 25, 55),
    planUntilAge: clamp(num(KEY.planUntilAge, d.planUntilAge), 80, 100),
    swrPct: clamp(num(KEY.swrPct, d.swrPct), SWR_MIN, SWR_MAX),
    setupUsd: clamp(num(KEY.setupUsd, d.setupUsd), 0, 1_000_000),
  };
}
