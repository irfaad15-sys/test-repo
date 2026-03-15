import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { CashFlowChart } from "@/components/charts/cashflow-chart";

const cashflow = [
  { entryId: "CF001", date: "2024-06-01", type: "inflow", category: "Client Payment", description: "3rd installment advance", amount: 1500000, runningBalance: 2800000 },
  { entryId: "CF002", date: "2024-06-03", type: "outflow", category: "Misc", description: "Diesel + equipment maintenance", amount: 15000, runningBalance: 2785000 },
  { entryId: "CF003", date: "2024-06-05", type: "outflow", category: "Material", description: "Aggregate purchase — RA/24/345", amount: 52000, runningBalance: 2733000 },
  { entryId: "CF004", date: "2024-06-06", type: "outflow", category: "Labor", description: "Weekly wages Week 23", amount: 245000, runningBalance: 2488000 },
  { entryId: "CF005", date: "2024-06-07", type: "outflow", category: "Material", description: "Cement purchase — ACC/24/7890", amount: 126000, runningBalance: 2362000 },
  { entryId: "CF006", date: "2024-06-10", type: "outflow", category: "Material", description: "Steel purchase — TS/2024/1456", amount: 518400, runningBalance: 1843600 },
];

const columns = [
  { key: "entryId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  {
    key: "type" as const, label: "Type",
    format: (v: unknown) => (
      <span className={v === "inflow" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
        {v === "inflow" ? "IN" : "OUT"}
      </span>
    ),
  },
  { key: "category" as const, label: "Category" },
  { key: "description" as const, label: "Description", className: "font-medium" },
  {
    key: "amount" as const, label: "Amount",
    format: (v: unknown, row: Record<string, unknown>) => (
      <span className={row.type === "inflow" ? "text-green-600" : "text-red-600"}>
        {row.type === "inflow" ? "+" : "-"}₹{Number(v).toLocaleString("en-IN")}
      </span>
    ),
  },
  { key: "runningBalance" as const, label: "Balance", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
];

export default function CashFlowPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cash Flow</h1>
        <p className="text-sm text-gray-500">Module 6 — In/out tracking with running balance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Current Balance" value="₹18.4L" />
        <StatCard title="Total Inflow" value="₹15.0L" subtitle="This month" />
        <StatCard title="Total Outflow" value="₹9.6L" subtitle="This month" />
        <StatCard title="Burn Rate" value="₹1.9L/day" />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Cash Flow Trend</CardTitle></CardHeader>
        <CardContent><CashFlowChart /></CardContent>
      </Card>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={cashflow} />
        </CardContent>
      </Card>
    </div>
  );
}
