'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const companyData = {
  Amazon: [
    { year: "2022", sales: 717 },
    { year: "2023", sales: 854 },
    { year: "2024", sales: 869 },
  ],
  eBay: [
    { year: "2022", sales: 10.42 },
    { year: "2023", sales: 10.27 },
    { year: "2024", sales: 10.32 },
  ],
  Alibaba: [
    { year: "2022", sales: 717 },
    { year: "2023", sales: 769 },
    { year: "2024", sales: 799 },
  ],
};

export function SalesChart() {
  const [company, setCompany] = useState("Amazon");
  const [threshold, setThreshold] = useState(0);

  const data = companyData[company].filter(d => d.sales >= threshold);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <select className="border p-2" value={company} onChange={e => setCompany(e.target.value)}>
          {Object.keys(companyData).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <input
          type="number"
          className="border p-2"
          placeholder="Sales threshold"
          onChange={e => setThreshold(Number(e.target.value))}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
