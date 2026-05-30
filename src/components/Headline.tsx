/**
 * Headline.tsx — the always-reachable answer: lowest "enough", funding %, and
 * years-to-fund. Sticky on scroll (spec §7).
 */
import { Check, TrendingUp } from "lucide-react";
import { SENSITIVITY_PCT } from "../data/assumptions";
import { usdCompact, usdFull } from "../lib/format";
import type { CityResult } from "../lib/model";
import { InfoTag } from "./ui";

export function Headline({
  lowest,
  range,
}: {
  lowest: CityResult;
  range: { low: number; high: number };
}) {
  const funded = Math.min(100, Math.round(lowest.fundedPct));
  const alreadyFunded = lowest.yearsToFund === 0;
  const unreachable = !Number.isFinite(lowest.yearsToFund);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sticky top-0 z-20 border-b border-paper-border bg-paper-bg/90 px-4 py-4 backdrop-blur dark:border-night-border dark:bg-night-bg/90 sm:px-6"
    >
      <p className="text-[13px] uppercase tracking-wide text-paper-muted dark:text-night-muted">
        Your lowest "enough" is
      </p>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-semibold sm:text-3xl">
          {lowest.city.name}
        </span>
        <span className="nums font-display text-3xl font-bold text-paper-accent dark:text-night-accent sm:text-4xl">
          {usdFull(lowest.totalUsd)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-paper-muted dark:text-night-muted">
        <span className="nums">
          range {usdCompact(range.low)}–{usdCompact(range.high)}
        </span>
        <InfoTag label="Estimate range">
          Our cost data (home prices, living costs) are asking / midpoint estimates, so
          the real number sits in a band — here, costs ±{SENSITIVITY_PCT}%. Asking prices
          skew high, so reality often lands in the lower half.
        </InfoTag>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="nums font-semibold">{funded}%</span>
          <span className="text-paper-muted dark:text-night-muted">funded today</span>
          <InfoTag label="Funded today">
            Your <b>net worth today</b> divided by the total this city needs.{" "}
            <b>100%</b> means you could stop working right now; lower means there's a gap
            still to fill.
          </InfoTag>
        </span>

        <span className="inline-flex items-center gap-1.5">
          {alreadyFunded ? (
            <>
              <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Already funded
              </span>
            </>
          ) : unreachable ? (
            <span className="text-paper-muted dark:text-night-muted">
              Not within reach at these inputs
            </span>
          ) : (
            <>
              <TrendingUp size={15} className="text-paper-muted dark:text-night-muted" />
              <span>
                <span className="nums font-semibold">≈{lowest.yearsToFund} yrs</span>
                <span className="text-paper-muted dark:text-night-muted">
                  {" "}
                  · funded by age{" "}
                </span>
                <span className="nums font-semibold">{lowest.fundedByAge}</span>
                {!lowest.withinHorizon && (
                  <span className="text-amber-700 dark:text-amber-400">
                    {" "}
                    (past your horizon)
                  </span>
                )}
              </span>
              <InfoTag label="Years to fund">
                How long until your net worth grows into the target — compounding at your{" "}
                <b>real return</b>, plus any savings if you're still working. "Funded by
                age" is simply your current age plus those years.
              </InfoTag>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
