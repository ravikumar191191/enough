import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useMemo, useState } from "react";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Headline } from "./components/Headline";
import { InputSummary } from "./components/InputSummary";
import { RankedTable } from "./components/RankedTable";
import { useTheme } from "./hooks/useTheme";
import { useUrlState } from "./hooks/useUrlState";
import { rankCities, totalRangeUsd } from "./lib/model";
import { usdFull } from "./lib/format";

export default function App() {
  const [inputs, patch, reset] = useUrlState();
  const [theme, toggleTheme] = useTheme();

  // Did this visit arrive from a shared link? Capture before useUrlState strips
  // the ref marker from the URL, then record it once.
  const [fromShare] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("ref") === "share"
  );
  useEffect(() => {
    if (fromShare) track("arrived_from_share");
  }, [fromShare]);

  // Re-rank every city on any input change. Pure + tiny → well under one frame.
  const ranked = useMemo(() => rankCities(inputs), [inputs]);
  // Apply the India/US/Both filter, then re-tag the lowest within the visible set.
  const visible = useMemo(() => {
    const list =
      inputs.filter === "both"
        ? ranked
        : ranked.filter((r) => r.city.geography === inputs.filter);
    return list.map((r, i) => ({ ...r, isLowest: i === 0 }));
  }, [ranked, inputs.filter]);
  const lowest = visible[0];

  // Sensitivity band on the lowest total (costs ±15%).
  const lowestRange = useMemo(() => totalRangeUsd(lowest.city, inputs), [lowest, inputs]);

  // The "where are you now?" baseline for the stay-or-go delta (from the full set,
  // so it's available even when filtered out).
  const baseline = useMemo(
    () =>
      inputs.currentCity === "none"
        ? null
        : ranked.find((r) => r.city.id === inputs.currentCity) ?? null,
    [ranked, inputs.currentCity]
  );

  // Display strings for the share card.
  const scenario = useMemo(() => {
    const funded = Math.min(100, Math.round(lowest.fundedPct));
    const line =
      lowest.yearsToFund === 0
        ? `${funded}% funded today - already free`
        : !Number.isFinite(lowest.yearsToFund)
          ? `${funded}% funded today`
          : `${funded}% funded today - free by age ${lowest.fundedByAge}`;
    return { city: lowest.city.name, amount: usdFull(lowest.totalUsd), line };
  }, [lowest]);

  return (
    <div className="min-h-screen">
      <Analytics />
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onReset={reset}
        scenario={scenario}
      />

      <Headline lowest={lowest} range={lowestRange} />

      <InputSummary inputs={inputs} lowest={lowest} baseline={baseline} />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,360px)_1fr]">
          <aside aria-label="Your situation">
            <h2 className="mb-4 font-display text-lg font-semibold">Your situation</h2>
            <Controls inputs={inputs} patch={patch} />
          </aside>

          <RankedTable
            results={visible}
            swrPct={inputs.swrPct}
            filter={inputs.filter}
            onFilterChange={(f) => patch({ filter: f })}
            baseline={baseline}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
