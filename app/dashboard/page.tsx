import { SalesChart } from "../../components/SalesChart";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
      <SalesChart />
    </div>
  );
}
