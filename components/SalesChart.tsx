'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { CompanyName } from '../lib/types';            // or '@/lib/types' if your alias works
import { useSalesData } from '../lib/useSalesData';          // or '@/lib/useSalesData'
import { filterByThreshold, sortByYear, totalSales, yoy } from '../lib/metrics'; // or '@/lib/metrics'

export function SalesChart() {
  const {
    company, setCompany,
    threshold, setThreshold,
    sortDir, setSortDir,
    loading, error, currentData
  } = useSalesData("Amazon");

  const filteredSorted = useMemo(() => {
    const base = currentData();
    return sortByYear(filterByThreshold(base, threshold), sortDir);
  }, [currentData, threshold, sortDir]);

  const total = useMemo(() => totalSales(filteredSorted), [filteredSorted]);
  const { lastYear, lastValue, yoyPct } = useMemo(() => yoy(filteredSorted), [filteredSorted]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Company:&nbsp;
          <select
            className="border rounded px-2 py-1"
            value={company}
            onChange={e => setCompany(e.target.value as CompanyName)}
          >
            {(["Amazon", "eBay", "Alibaba"] as CompanyName[]).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Min sales:&nbsp;
          <input
            type="number"
            className="border rounded px-2 py-1 w-28"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
          />
        </label>

        <label className="text-sm">
          Sort:&nbsp;
          <select
            className="border rounded px-2 py-1"
            value={sortDir}
            onChange={e => setSortDir(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Year ↑</option>
            <option value="desc">Year ↓</option>
          </select>
        </label>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Total Sales (filtered)</div>
          <div className="text-xl font-semibold">{total.toLocaleString()}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Last Year {lastYear ? `(${lastYear})` : ""}</div>
          <div className="text-xl font-semibold">{lastValue ?? "—"}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">YoY Change</div>
          <div className="text-xl font-semibold">
            {yoyPct === null ? "—" : `${yoyPct.toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 320 }}>
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredSorted}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" /> {/* explicit colour */}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
