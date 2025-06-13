#Sales Dashboard
An interactive sales analytics dashboard built with **Next.js**, **Tailwind CSS**, and **Recharts**. It visualises sales data (in billions of USD) for Amazon, eBay, and Alibaba from 2022 to 2024.

##Features
Interactive bar charts with `Recharts`
Company selector dropdown (Amazon, eBay, Alibaba)
Sales threshold filter
Responsive and clean Tailwind-styled layout
Built using Next.js App Router and TypeScript

## Getting Started

### 1.Clone the project

```bash
git clone https://github.com/yourusername/sales-dashboard.git
cd sales-dashboard/sales-dashboard
2. Install dependencies
bash

npm install
3. Run the development server
bash

npm run dev
Open your browser and go to:
http://localhost:3000/dashboard

Tech Stack
Next.js

Tailwind CSS

Recharts

TypeScript

Project Structure
/app
  ├── dashboard/page.tsx      → Renders the main dashboard
  ├── layout.tsx              → Root layout
  └── globals.css             → Tailwind styles
/components
  └── SalesChart.tsx          → Interactive chart component

Data Source
The sales figures are based on public financial summaries from Amazon, eBay, and Alibaba for 2022–2024.