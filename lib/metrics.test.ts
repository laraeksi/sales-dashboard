import { describe, it, expect } from "vitest";
import { filterByThreshold, sortByYear, totalSales, yoy } from "./metrics";
import type { SalesRecord } from "./types";

const data: SalesRecord[] = [
  { year: 2022, sales: 100 },
  { year: 2023, sales: 120 },
  { year: 2024, sales: 90 },
];

describe("metrics", () => {
  it("filters by threshold", () => {
    expect(filterByThreshold(data, 110)).toEqual([{ year: 2023, sales: 120 }]);
  });

  it("sorts by year asc/desc", () => {
    expect(sortByYear(data, "asc")[0].year).toBe(2022);
    expect(sortByYear(data, "desc")[0].year).toBe(2024);
  });

  it("totals sales", () => {
    expect(totalSales(data)).toBe(310);
  });

  it("computes YoY on last two points", () => {
    const { lastYear, lastValue, prevValue, yoyPct } = yoy(data);
    expect(lastYear).toBe(2024);
    expect(lastValue).toBe(90);
    expect(prevValue).toBe(120);
    expect(yoyPct && Math.round(yoyPct)).toBe(-25);
  });
});
