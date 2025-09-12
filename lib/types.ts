export type CompanyName = "Amazon" | "eBay" | "Alibaba";

export interface SalesRecord {
  year: number;
  sales: number;
}

export type SalesMap = Record<CompanyName, SalesRecord[]>;
