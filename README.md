# Sales Analytics Dashboard (Next.js + TypeScript)

**Live demo (Vercel):** https://www.necladerinlaraesales.com  
**Repository:** https://github.com/laraeksi/sales-dashboard  
![CI](https://github.com/laraeksi/sales-dashboard/actions/workflows/test.yml/badge.svg)

Interactive sales dashboard for exploring multi-year company data with filters, KPIs and responsive charts.  
Data is loaded from **CSV** via a lightweight **Next.js API route** and visualised with **Recharts**.

## Features
- Company selector (**Amazon / eBay / Alibaba**)
- Min-sales threshold filter
- Sort by year (↑ / ↓)
- KPIs: **Total Sales**, **Last Year value**, **YoY % change**
- Responsive bar chart with tooltip & legend
- Typed data layer (TypeScript types + custom hook)
- Pure metric helpers with unit tests (Vitest)

## Tech Stack
- **Next.js (App Router)**, **React 18**, **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for data-vis
- **Vitest** for unit tests

## Project Structure
app/
api/sales/route.ts # CSV → JSON API (auto-detects delimiters/number formats)
page.tsx # redirects/renders dashboard at /
dashboard/page.tsx # (if kept) dashboard route
globals.css, layout.tsx
components/
SalesChart.tsx
lib/
types.ts # CompanyName, SalesRecord, SalesMap
metrics.ts # filter/sort/total/yoy (pure/tested)
useSalesData.ts # fetch + UI state (company, threshold, sort)
public/
data/
Amazon.csv
eBay.csv
Alibaba.csv


## Getting Started
npm install
npm run dev
# open http://localhost:3000  (root redirects to /dashboard if you kept that route)
Tests
npm run test          # one-off
npm run test:watch    # watch mode
Data & API
Source data: CSV in public/data/.
The parser auto-detects , vs ; delimiters and EU/US number formats (e.g. 22,1 → 22.1).

Endpoint: GET /api/sales → returns:

json
{ "Amazon": [{ "year": 2019, "sales": 88.3 }, ...], "eBay": [...], "Alibaba": [...] }
Deployment (Vercel)
Hosted at https://www.necladerinlaraesales.com (custom domain on Vercel).

CSVs are served from public/data/ so they’re available at runtime.

API route hints:

// app/api/sales/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// reads from: path.join(process.cwd(), "public", "data")
CI (optional but recommended)
Add this workflow at .github/workflows/test.yml to run unit tests on every push/PR:

name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test
Notes
If the chart is blank, ensure the wrapper has a fixed height (e.g. className="h-[320px]") and that /api/sales returns arrays.

You can access raw CSVs directly at /data/Amazon.csv, /data/eBay.csv, /data/Alibaba.csv.

Licence
MIT
