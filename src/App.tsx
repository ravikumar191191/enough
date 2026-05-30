import { useMemo } from "react";
import { Controls } from "./components/Controls";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Headline } from "./components/Headline";
import { InputSummary } from "./components/InputSummary";
import { RankedTable } from "./components/RankedTable";
import { useTheme } from "./hooks/useTheme";
import { useUrlState } from "./hooks/useUrlState";
import { rankCities } from "./lib/model";

export default function App() {
  const [inputs, patch, reset] = useUrlState();
  const [theme, toggleTheme] = useTheme();

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

  return (
    <div className="min-h-screen">
      <Header theme={theme} onToggleTheme={toggleTheme} onReset={reset} />

      <Headline lowest={lowest} />

      <InputSummary inputs={inputs} lowest={lowest} />

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
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
