/**
 * format.ts — display helpers. Money in/out as numbers; strings only at the edge.
 */

/** Compact USD, e.g. $1.2M, $940K, $0. Tuned for headline + table cells. */
export function usdCompact(n: number): string {
  const v = Math.round(n);
  if (Math.abs(v) >= 1_000_000) {
    const m = v / 1_000_000;
    // 1 decimal under 10M, else whole millions
    return `$${m >= 10 ? Math.round(m) : trim(m, 1)}M`;
  }
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1000)}K`;
  return `$${v.toLocaleString("en-US")}`;
}

/** Full USD with separators, e.g. $1,240,000. */
export function usdFull(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/**
 * Indian-format ₹ in lakh/crore, e.g. ₹2.4 Cr, ₹85 L. Input is rupees.
 */
export function inrCompact(rupees: number): string {
  const v = Math.round(rupees);
  if (Math.abs(v) >= 1e7) return `₹${trim(v / 1e7, 2)} Cr`;
  if (Math.abs(v) >= 1e5) return `₹${trim(v / 1e5, 1)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

/** Percent with given decimals, e.g. 3.5%. */
export function pct(n: number, decimals = 0): string {
  return `${trim(n, decimals)}%`;
}

/** Trim trailing zeros after rounding to `d` decimals. */
function trim(n: number, d: number): string {
  return parseFloat(n.toFixed(d)).toLocaleString("en-US");
}
