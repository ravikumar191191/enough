/**
 * Footer.tsx — the honesty section: caveats, sources, last-updated, not-advice.
 * Spec §10. Sourced from assumptions so the date never drifts from the data.
 */
import { FX, LAST_UPDATED } from "../data/assumptions";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-paper-border px-4 pb-10 pt-6 text-[12px] leading-relaxed text-paper-muted dark:border-night-border dark:text-night-muted sm:px-6">
      <p className="mb-2">
        <span className="font-semibold text-paper-ink dark:text-night-ink">
          Read this first.
        </span>{" "}
        Asking-side prices run high — transactions often close 15–20% lower.
        Cross-currency comparison is directional, not lifestyle-identical: a
        "Luxury" life costs different absolute dollars in each city by design. Tax
        is simplified to effective rates, not a filing engine. This is{" "}
        <span className="font-semibold text-paper-ink dark:text-night-ink">
          not financial advice
        </span>
        .
      </p>
      <p className="mb-2">
        Data last updated <b>{LAST_UPDATED}</b> · FX {FX} ₹/$. Sources: 99acres /
        NoBroker / Square Yards (India homes), Redfin / Zillow (US medians, adjusted
        up for good-district family homes), standard 2026 property-tax & ACA rates,
        India new-regime FY25-26 and US federal 2025/26 tax tables.
      </p>
      <p>
        Open source · built with{" "}
        <a
          href="https://claude.com/claude-code"
          className="focusable rounded underline decoration-dotted underline-offset-2 hover:text-paper-accent dark:hover:text-night-accent"
        >
          Claude Code
        </a>
        . All inputs live in the URL — copy the link to share your exact scenario.
      </p>
    </footer>
  );
}
