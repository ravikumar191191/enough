/**
 * RankedTable.tsx — the product. India + US cities in ONE ranked list (spec §3),
 * all in USD with an ₹ echo for India. Mobile-first cards that line up like a
 * table on wider screens. Re-ranks instantly as inputs change.
 */
import { Award } from "lucide-react";
import type { Flag } from "../data/assumptions";
import { inrCompact, usdCompact, usdFull } from "../lib/format";
import type { CityResult } from "../lib/model";
import { InfoTag } from "./ui";

const FLAG_STYLE: Record<Flag["kind"], string> = {
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
};

function FlagChip({ flag }: { flag: Flag }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${FLAG_STYLE[flag.kind]}`}
    >
      {flag.label}
      <InfoTag label={flag.label}>{flag.detail}</InfoTag>
    </span>
  );
}

function fundedLabel(r: CityResult): string {
  if (r.yearsToFund === 0) return "Funded";
  if (!Number.isFinite(r.yearsToFund)) return "out of reach";
  return `~${r.yearsToFund}y to age ${r.fundedByAge}`;
}

function Row({ r, rank }: { r: CityResult; rank: number }) {
  const funded = Math.min(100, Math.round(r.fundedPct));
  const flag = r.city.geography === "india" ? "🇮🇳" : "🇺🇸";

  return (
    <li
      className={[
        "rounded-xl border p-4 transition-colors",
        r.isLowest
          ? "border-paper-accent bg-paper-accent/5 dark:border-night-accent dark:bg-night-accent/10"
          : "border-paper-border bg-paper-panel dark:border-night-border dark:bg-night-panel",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        {/* City identity */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="nums w-5 shrink-0 text-sm font-semibold text-paper-muted dark:text-night-muted">
              {rank}
            </span>
            <span aria-hidden>{flag}</span>
            <h3 className="font-display text-lg font-semibold">{r.city.name}</h3>
            {r.isLowest && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-paper-accent px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-night-accent dark:text-night-bg">
                <Award size={12} /> Lowest
              </span>
            )}
          </div>
          <p className="mt-0.5 pl-7 text-[12px] text-paper-muted dark:text-night-muted">
            {r.city.region}
          </p>
          {r.flags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5 pl-7">
              {r.flags.map((f) => (
                <FlagChip key={f.label} flag={f} />
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="shrink-0 text-right">
          <div className="nums font-display text-xl font-bold sm:text-2xl">
            {usdFull(r.totalUsd)}
          </div>
          {r.totalInr !== null && (
            <div className="nums text-[12px] text-paper-muted dark:text-night-muted">
              {inrCompact(r.totalInr)}
            </div>
          )}
        </div>
      </div>

      {/* Funding read-out + breakdown */}
      <div className="mt-3 pl-7">
        <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-paper-muted dark:text-night-muted">
          <span>Funded today</span>
          <span className="nums normal-case tracking-normal">
            {funded}% · {fundedLabel(r)}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-paper-border dark:bg-night-border"
          role="progressbar"
          aria-valuenow={funded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${r.city.name} funded today`}
        >
          <div
            className="h-full rounded-full bg-paper-accent dark:bg-night-accent"
            style={{ width: `${funded}%` }}
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-paper-muted dark:text-night-muted">
          <span>
            Upfront <span className="nums text-paper-ink dark:text-night-ink">{usdCompact(r.upfrontUsd)}</span>
          </span>
          <span>
            Corpus <span className="nums text-paper-ink dark:text-night-ink">{usdCompact(r.corpusUsd)}</span>
          </span>
          <span>
            Spend/yr <span className="nums text-paper-ink dark:text-night-ink">{usdCompact(r.annualSpendUsd)}</span>
          </span>
          {r.netIncomeUsd > 0 && (
            <span>
              Net income <span className="nums text-paper-ink dark:text-night-ink">{usdCompact(r.netIncomeUsd)}</span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function RankedTable({ results }: { results: CityResult[] }) {
  return (
    <section aria-label="Cities ranked by total needed">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Ranked — lowest first</h2>
        <span className="text-[12px] text-paper-muted dark:text-night-muted">
          total in USD
        </span>
      </div>
      <ol className="flex flex-col gap-2.5" aria-live="polite">
        {results.map((r, i) => (
          <Row key={r.city.id} r={r} rank={i + 1} />
        ))}
      </ol>
    </section>
  );
}
