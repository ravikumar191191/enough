import { describe, expect, it } from "vitest";
import { CITIES } from "../data/assumptions";
import {
  DEFAULT_INPUTS,
  afterTaxIndia,
  afterTaxUS,
  computeCity,
  rankCities,
  yearsToFund,
  type Inputs,
} from "./model";
import { decodeInputs, encodeInputs } from "./urlState";

const india = CITIES.find((c) => c.geography === "india")!;
const us = CITIES.find((c) => c.geography === "us")!;

describe("tax", () => {
  it("returns 0 net for 0 gross", () => {
    expect(afterTaxIndia(0)).toBe(0);
    expect(afterTaxUS(0, 13)).toBe(0);
  });

  it("never takes more than you earn and is monotonic", () => {
    let prev = -1;
    for (const g of [5e5, 1e6, 2e6, 5e6, 1e7, 3e7]) {
      const net = afterTaxIndia(g);
      expect(net).toBeGreaterThan(prev);
      expect(net).toBeLessThan(g);
      prev = net;
    }
  });

  it("state tax makes WA (0%) keep more than CA (13%) at the same salary", () => {
    expect(afterTaxUS(300_000, 0)).toBeGreaterThan(afterTaxUS(300_000, 13));
  });
});

describe("yearsToFund", () => {
  it("is 0 when already funded", () => {
    expect(yearsToFund(2_000_000, 1_000_000, 7, 0)).toBe(0);
  });
  it("is finite with positive return even with no savings", () => {
    const y = yearsToFund(500_000, 1_000_000, 7, 0);
    expect(Number.isFinite(y)).toBe(true);
    expect(y).toBeGreaterThan(0);
  });
  it("funds faster with more savings", () => {
    const slow = yearsToFund(500_000, 2_000_000, 5, 0);
    const fast = yearsToFund(500_000, 2_000_000, 5, 100_000);
    expect(fast).toBeLessThan(slow);
  });
});

describe("computeCity — tenure", () => {
  it("buy puts the home into upfront; rent does not", () => {
    const buy = computeCity(india, { ...DEFAULT_INPUTS, tenure: "buy" });
    const rent = computeCity(india, { ...DEFAULT_INPUTS, tenure: "rent" });
    expect(buy.homeUsd).toBeGreaterThan(0);
    expect(rent.homeUsd).toBe(0);
    expect(buy.upfrontUsd).toBeGreaterThan(rent.upfrontUsd);
  });

  it("US property tax & healthcare land in annual spend, not upfront (acceptance §9.4)", () => {
    // Seattle, default inputs: home 1.5M, base 90k×1.3, healthcare 28k, propTax 0.92%.
    const sea = CITIES.find((c) => c.id === "SEA")!;
    const buy = computeCity(sea, { ...DEFAULT_INPUTS, tenure: "buy" });
    const base = 90_000 * 1.3;
    const healthcare = 28_000;
    const propTax = 1_500_000 * 0.0092;

    // recurring drivers are in annual spend...
    expect(buy.annualSpendUsd).toBeCloseTo(base + healthcare + propTax, 2);
    // ...and NOT in upfront, which is just home + closing + setup.
    expect(buy.upfrontUsd).toBeCloseTo(1_500_000 * 1.01 + DEFAULT_INPUTS.setupUsd, 2);
    expect(buy.upfrontUsd).toBeLessThan(buy.homeValueUsd * 1.02 + DEFAULT_INPUTS.setupUsd);
  });
});

describe("ranking", () => {
  it("returns all cities, sorted ascending, lowest tagged", () => {
    const r = rankCities(DEFAULT_INPUTS);
    expect(r).toHaveLength(CITIES.length);
    for (let i = 1; i < r.length; i++) {
      expect(r[i].totalUsd).toBeGreaterThanOrEqual(r[i - 1].totalUsd);
    }
    expect(r[0].isLowest).toBe(true);
    expect(r.slice(1).every((x) => !x.isLowest)).toBe(true);
  });

  it("earners reduce the corpus (covered spending)", () => {
    const none = computeCity(us, { ...DEFAULT_INPUTS, workers: 0 });
    const both = computeCity(us, {
      ...DEFAULT_INPUTS,
      workers: 2,
      salaryUsdPerEarner: 200_000,
    });
    expect(both.corpusUsd).toBeLessThan(none.corpusUsd);
  });
});

describe("url state round-trips", () => {
  it("encode→decode reproduces exact inputs", () => {
    const custom: Inputs = {
      ...DEFAULT_INPUTS,
      tenure: "rent",
      kids: 2,
      workers: 2,
      segment: "luxury",
      netWorthUsd: 3_250_000,
      swrPct: 2.8,
      currentAge: 41,
    };
    expect(decodeInputs(encodeInputs(custom))).toEqual(custom);
  });

  it("defaults produce an empty query and decode back to defaults", () => {
    expect(encodeInputs(DEFAULT_INPUTS)).toBe("");
    expect(decodeInputs("")).toEqual(DEFAULT_INPUTS);
  });

  it("ignores garbage and clamps out-of-range numbers", () => {
    const got = decodeInputs("?sg=banana&sw=99&ca=3");
    expect(got.segment).toBe(DEFAULT_INPUTS.segment);
    expect(got.swrPct).toBe(4.0); // clamped to SWR_MAX
    expect(got.currentAge).toBe(25); // clamped to min
  });
});
