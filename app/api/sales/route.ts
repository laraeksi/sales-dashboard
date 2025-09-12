// app/api/sales/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";


type CompanyName = "Amazon" | "eBay" | "Alibaba";
interface SalesRecord { year: number; sales: number; }
type SalesMap = Record<CompanyName, SalesRecord[]>;

function parseNumberEUorUS(raw: string): number {
  let v = raw.trim();
  if (v === "") return NaN;

  // If looks like European format (comma decimal), remove thousands and swap comma -> dot
  const hasComma = v.includes(",");
  const hasDot = v.includes(".");
  if (hasComma && (!hasDot || v.lastIndexOf(",") > v.lastIndexOf("."))) {
    // e.g. 1.234,56  or  22,1
    v = v.replace(/\./g, "").replace(/,/g, ".");
  } else {
    // e.g. 1,234.56  or  717
    v = v.replace(/,/g, "");
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function parseCSV(text: string): SalesRecord[] {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  // Detect delimiter from header
  const headerLine = lines[0];
  const delimiter =
    headerLine.includes(";") && !headerLine.includes(",") ? ";" : ",";

  const split = (line: string) =>
    line
      .split(delimiter)
      .map(cell => cell.trim().replace(/^"|"$/g, ""));

  const header = split(headerLine).map(h => h.toLowerCase());
  let yearIdx = header.indexOf("year");
  let salesIdx = header.indexOf("sales");

  const out: SalesRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = split(lines[i]);

    // --- YEAR ---
    let year: number | null = null;
    if (yearIdx !== -1 && cols[yearIdx]) {
      const m = String(cols[yearIdx]).match(/\b(19|20)\d{2}\b/);
      if (m) year = Number(m[0]);
    }
    if (year === null) {
      // Fallback: look for a 4-digit year anywhere (handles "2018 Q1")
      const joined = cols.join(" ");
      const m = joined.match(/\b(19|20)\d{2}\b/);
      if (m) year = Number(m[0]);
    }

    // --- SALES ---
    let sales: number | null = null;

    // 1) If we have a "sales" column, try that first
    if (salesIdx !== -1 && cols[salesIdx] != null) {
      const n = parseNumberEUorUS(cols[salesIdx]);
      if (Number.isFinite(n)) sales = n;
    }

    // 2) Otherwise pick the last numeric-looking column
    if (sales === null) {
      for (let j = cols.length - 1; j >= 0; j--) {
        const n = parseNumberEUorUS(cols[j]);
        if (Number.isFinite(n)) {
          sales = n;
          break;
        }
      }
    }

    if (year != null && sales != null) {
      out.push({ year, sales });
    }
  }

  return out;
}


export async function GET() {
  const base = path.join(process.cwd(), "data", "raw");
  const files: Record<CompanyName, string> = {
    Amazon: "Amazon.csv",
    eBay: "eBay.csv",
    Alibaba: "Alibaba.csv",
  };

  const result: Partial<SalesMap> = {};
  for (const [company, filename] of Object.entries(files) as [CompanyName, string][]) {
    const full = path.join(base, filename);
    const text = await fs.readFile(full, "utf-8");
    result[company] = parseCSV(text);
  }

  return NextResponse.json(result as SalesMap);
}
