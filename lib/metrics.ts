import type { SalesRecord } from "./types";

/** Keep only rows with sales >= minSales */
export function filterByThreshold(data: SalesRecord[], minSales: number): SalesRecord[] {
  return data.filter(d => d.sales >= minSales);
}

/** Return a NEW array sorted by year asc/desc */
export function sortByYear(data: SalesRecord[], direction: "asc" | "desc"): SalesRecord[] {
  return [...data].sort((a, b) => (direction === "asc" ? a.year - b.year : b.year - a.year));
}

/** Sum sales */
export function totalSales(data: SalesRecord[]): number {
  return data.reduce((sum, d) => sum + d.sales, 0);
}

/** YoY on the last two points (after sorting asc). Nulls if insufficient data. */
export function yoy(data: SalesRecord[]): {
  lastYear: number | null;
  lastValue: number | null;
  prevValue: number | null;
  yoyPct: number | null;
} {
  if (data.length < 2) return { lastYear: null, lastValue: null, prevValue: null, yoyPct: null };
  const sorted = sortByYear(data, "asc");
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const yoyPct = prev.sales === 0 ? null : ((last.sales - prev.sales) / Math.abs(prev.sales)) * 100;
  return { lastYear: last.year, lastValue: last.sales, prevValue: prev.sales, yoyPct };
}
