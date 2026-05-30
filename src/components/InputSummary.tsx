/**
 * InputSummary.tsx — a plain-English recap of the whole scenario: who you are,
 * how you want to live, what you've assumed, and the resulting lowest "enough"
 * with a one-line "why". Lets you grasp all the inputs without scrolling the
 * controls panel.
 *
 * NOTE: this is generated deterministically from the inputs (a template), not by
 * an LLM. That keeps it instant, free, offline, and shareable via URL with no
 * backend. A true LLM-written summary is a possible later upgrade (see BACKLOG.md)
 * but would require a serverless function to hold the API key.
 */
import type { HomeType, Lifestyle, Segment } from "../data/assumptions";
import { inrCompact, usdCompact, usdFull } from "../lib/format";
import type { CityResult, Inputs } from "../lib/model";

const HOME_LABEL: Record<HomeType, string> = {
  "3bhk": "3 BHK",
  "4bhk": "4 BHK",
  "5bhk": "5 BHK",
  penthouse: "penthouse",
  bungalow: "bungalow",
};
const SEGMENT_LABEL: Record<Segment, string> = {
  mid: "mid-market",
  premium: "premium",
  luxury: "luxury",
};
const LIFESTYLE_PHRASE: Record<Lifestyle, string> = {
  comfortable: "a comfortable",
  affluent: "an affluent",
  luxury: "a luxury",
};

function kidsPhrase(kids: number): string {
  return kids === 0 ? "no kids" : kids === 1 ? "one child" : "two children";
}

function workPhrase(inp: Inputs, lowest: CityResult): string {
  if (inp.workers === 0) return "neither of you earning";
  // Show the salary for the country of the lowest-cost city.
  const sal =
    lowest.city.geography === "india"
      ? inrCompact(inp.salaryInrPerEarner)
      : usdCompact(inp.salaryUsdPerEarner);
  if (inp.workers === 1) return `one of you grossing ${sal}`;
  return `both of you earning ${sal} each`;
}

function fundingClause(r: CityResult): string {
  if (r.yearsToFund === 0) return " — and you're already fully funded";
  if (!Number.isFinite(r.yearsToFund)) return ", which isn't reachable at these inputs";
  const yrs = `${r.yearsToFund} year${r.yearsToFund === 1 ? "" : "s"}`;
  const horizon = r.withinHorizon ? "" : ", past your planning horizon";
  return `, reachable in about ${yrs} (by age ${r.fundedByAge})${horizon}`;
}

function whySentence(r: CityResult, inp: Inputs): string {
  const corpus = usdCompact(r.corpusUsd);
  const spend = usdCompact(r.annualSpendUsd);
  const upfront = usdCompact(r.upfrontUsd);
  if (inp.tenure === "buy") {
    return `That's mostly a ${corpus} invested nest egg to cover about ${spend}/yr of living costs, plus ${upfront} upfront for the home and setup.`;
  }
  return `That's a ${corpus} invested nest egg to cover about ${spend}/yr of living costs (rent included), plus ${upfront} to get set up.`;
}

export function InputSummary({
  inputs,
  lowest,
  baseline,
}: {
  inputs: Inputs;
  lowest: CityResult;
  baseline: CityResult | null;
}) {
  const funded = Math.min(100, Math.round(lowest.fundedPct));

  // Stay-or-go delta vs the user's current city.
  const showDelta = baseline && baseline.city.id !== lowest.city.id;
  const cheaper = baseline ? lowest.totalUsd <= baseline.totalUsd : true;
  const dollarAbs = baseline ? Math.abs(baseline.totalUsd - lowest.totalUsd) : 0;
  const bothFinite =
    baseline && Number.isFinite(lowest.yearsToFund) && Number.isFinite(baseline.yearsToFund);
  const yearsAbs = baseline ? Math.abs(baseline.yearsToFund - lowest.yearsToFund) : 0;
  const sooner = baseline ? baseline.yearsToFund - lowest.yearsToFund > 0 : false;

  return (
    <section
      aria-label="Plain-English summary of your inputs and result"
      className="mx-auto max-w-5xl px-4 pt-5 sm:px-6"
    >
      <div className="rounded-xl border border-paper-border bg-paper-panel p-4 dark:border-night-border dark:bg-night-panel sm:p-5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-paper-muted dark:text-night-muted">
          In plain English
        </p>
        <p className="font-body text-[15px] leading-relaxed sm:text-base">
          You're <strong>{inputs.currentAge}</strong>, planning to age{" "}
          <strong>{inputs.planUntilAge}</strong>, with {kidsPhrase(inputs.kids)} — and you
          want to <strong>{inputs.tenure}</strong> a {SEGMENT_LABEL[inputs.segment]}{" "}
          {HOME_LABEL[inputs.homeType]} and live {LIFESTYLE_PHRASE[inputs.lifestyle]}{" "}
          lifestyle. With <strong>{usdFull(inputs.netWorthUsd)}</strong> invested today and{" "}
          {workPhrase(inputs, lowest)}, modeled at a <strong>{inputs.swrPct}%</strong> withdrawal
          rate and <strong>{inputs.realReturnPct}%</strong> real returns, your lowest-cost
          path is <strong>{lowest.city.name}</strong> at{" "}
          <strong className="text-paper-accent dark:text-night-accent">
            {usdFull(lowest.totalUsd)}
          </strong>{" "}
          — <strong>{funded}%</strong> funded today{fundingClause(lowest)}.{" "}
          {whySentence(lowest, inputs)}
        </p>
        {showDelta && baseline && (
          <p className="mt-3 font-body text-[15px] leading-relaxed sm:text-base">
            Compared with <strong>{baseline.city.name}</strong> (
            <strong className="nums">{usdFull(baseline.totalUsd)}</strong>), that's about{" "}
            <strong
              className={`nums ${cheaper ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
            >
              {usdCompact(dollarAbs)} {cheaper ? "less" : "more"}
            </strong>
            {bothFinite && yearsAbs !== 0 && (
              <>
                {" "}
                and{" "}
                <strong className="nums">
                  ~{yearsAbs} years {sooner ? "sooner" : "later"}
                </strong>
              </>
            )}
            .
          </p>
        )}
        <p className="mt-3 border-t border-paper-border pt-2 text-[11.5px] leading-snug text-paper-muted dark:border-night-border dark:text-night-muted">
          Directional, not advice: figures use asking-side prices (deals often close
          15–20% lower) and simplified effective taxes. Tune the assumptions below.
        </p>
      </div>
    </section>
  );
}
