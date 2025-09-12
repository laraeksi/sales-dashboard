"use client";

import { useEffect, useState } from "react";
import type { SalesMap, SalesRecord, CompanyName } from "./types";

/**
 * Client hook to fetch /api/sales (CSV → JSON), keep state, and expose helpers.
 */
export function useSalesData(defaultCompany: CompanyName = "Amazon") {
  const [raw, setRaw] = useState<SalesMap | null>(null);
  const [company, setCompany] = useState<CompanyName>(defaultCompany);
  const [threshold, setThreshold] = useState<number>(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/sales", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as SalesMap;
        if (!cancel) setRaw(data);
      } catch (e: any) {
        if (!cancel) setError(String(e?.message ?? e));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  function setCompanySafe(v: string) {
    setCompany(v as CompanyName);
  }

  function currentData(): SalesRecord[] {
    if (!raw) return [];
    // Defensive casts in case CSV parse gives strings
    return (raw[company] ?? []).map(d => ({
      year: Number(d.year),
      sales: Number(d.sales),
    }));
  }

  return {
    raw,
    company,
    setCompany: setCompanySafe,
    threshold,
    setThreshold,
    sortDir,
    setSortDir,
    loading,
    error,
    currentData,
  };
}
