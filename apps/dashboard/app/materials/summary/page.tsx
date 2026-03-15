import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const summary = [
  { materialName: "Cement (OPC 53)", unit: "bags", concreteQty: 3700, brickworkQty: 680, plasteringQty: 2044, totalRequired: 6424, ordered: 5500, received: 5200, used: 4955, balance: 245 },
  { materialName: "M-Sand", unit: "cft", concreteQty: 6988, brickworkQty: 238, plasteringQty: 672, totalRequired: 7898, ordered: 7000, received: 6800, used: 6400, balance: 400 },
  { materialName: "20mm Aggregate", unit: "cft", concreteQty: 9126, brickworkQty: 0, plasteringQty: 0, totalRequired: 9126, ordered: 8000, received: 7500, used: 7100, balance: 400 },
  { materialName: "12mm Aggregate", unit: "cft", concreteQty: 4113, brickworkQty: 0, plasteringQty: 0, totalRequired: 4113, ordered: 3500, received: 3200, used: 3000, balance: 200 },
  { materialName: "Steel (Fe500D)", unit: "kg", concreteQty: 0, brickworkQty: 0, plasteringQty: 0, totalRequired: 45000, ordered: 38000, received: 36200, used: 34500, balance: 1700 },
  { materialName: "Bricks (Wire-cut)", unit: "nos", concreteQty: 0, brickworkQty: 85050, plasteringQty: 0, totalRequired: 85050, ordered: 75000, received: 73000, used: 66500, balance: 6500 },
];

const columns = [
  { key: "materialName" as const, label: "Material", className: "font-medium" },
  { key: "unit" as const, label: "Unit" },
  { key: "totalRequired" as const, label: "Required", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "ordered" as const, label: "Ordered", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "received" as const, label: "Received", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "used" as const, label: "Used", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "balance" as const, label: "Balance", format: (v: unknown) => Number(v).toLocaleString("en-IN"), className: "font-medium" },
  {
    key: "totalRequired" as const, label: "% Ordered",
    format: (v: unknown, row: Record<string, unknown>) => {
      const pct = ((Number(row.ordered) / Number(v)) * 100).toFixed(0);
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(Number(pct), 100)}%` }} />
          </div>
          <span className="text-xs">{pct}%</span>
        </div>
      );
    },
  },
];

export default function MaterialSummaryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Material Summary</h1>
        <p className="text-sm text-gray-500">Module 2 — Aggregated from all calculators → feeds dashboards + reports</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total Materials" value={6} />
        <StatCard title="Fully Ordered" value={0} subtitle="All partially ordered" />
        <StatCard title="Procurement Gap" value="12%" subtitle="Avg shortfall" />
        <StatCard title="Low Stock Items" value={2} className="border-red-200 bg-red-50" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Requirements vs Procurement</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={summary} />
        </CardContent>
      </Card>
    </div>
  );
}
