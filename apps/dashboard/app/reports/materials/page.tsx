import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const materialReport = [
  { materialName: "Cement", budgetQty: 6424, actualUsed: 4955, variance: -1469, wastagePercent: 3.2, cost: 2081100 },
  { materialName: "Sand", budgetQty: 7898, actualUsed: 6400, variance: -1498, wastagePercent: 2.1, cost: 288000 },
  { materialName: "20mm Aggregate", budgetQty: 9126, actualUsed: 7100, variance: -2026, wastagePercent: 1.8, cost: 269800 },
  { materialName: "Steel", budgetQty: 45000, actualUsed: 34500, variance: -10500, wastagePercent: 5.5, cost: 2484000 },
  { materialName: "Bricks", budgetQty: 85050, actualUsed: 66500, variance: -18550, wastagePercent: 4.8, cost: 631750 },
];

const columns = [
  { key: "materialName" as const, label: "Material", className: "font-medium" },
  { key: "budgetQty" as const, label: "Budget Qty", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "actualUsed" as const, label: "Used", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  {
    key: "variance" as const, label: "Remaining",
    format: (v: unknown) => <span className="text-green-600">{Math.abs(Number(v)).toLocaleString("en-IN")}</span>,
  },
  { key: "wastagePercent" as const, label: "Wastage %", format: (v: unknown) => `${v}%` },
  { key: "cost" as const, label: "Cost", format: (v: unknown) => `₹${(Number(v) / 100000).toFixed(1)}L`, className: "font-medium" },
];

const totalCost = materialReport.reduce((s, m) => s + m.cost, 0);

export default function MaterialReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Material Report</h1>
        <p className="text-sm text-gray-500">Module 7 — Consumption vs budget with wastage analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total Material Cost" value={`₹${(totalCost / 100000).toFixed(1)}L`} />
        <StatCard title="Avg Wastage" value="3.5%" />
        <StatCard title="Wastage Value" value="₹2.8L" />
      </div>

      <Card>
        <CardHeader><CardTitle>Material Consumption Report</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={materialReport} />
        </CardContent>
      </Card>
    </div>
  );
}
