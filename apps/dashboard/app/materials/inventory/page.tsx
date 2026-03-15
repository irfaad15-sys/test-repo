import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const inventory = [
  { materialName: "OPC 53 Cement", unit: "bags", openingStock: 200, totalReceived: 300, totalIssued: 455, closingStock: 45, reorderLevel: 100, isLow: true },
  { materialName: "M-Sand", unit: "cft", openingStock: 800, totalReceived: 1200, totalIssued: 1400, closingStock: 600, reorderLevel: 500, isLow: false },
  { materialName: "20mm Aggregate", unit: "cft", openingStock: 600, totalReceived: 900, totalIssued: 1100, closingStock: 400, reorderLevel: 400, isLow: false },
  { materialName: "Fe500D TMT 16mm", unit: "kg", openingStock: 3000, totalReceived: 7200, totalIssued: 8500, closingStock: 1700, reorderLevel: 2000, isLow: true },
  { materialName: "Fe500D TMT 12mm", unit: "kg", openingStock: 2500, totalReceived: 5400, totalIssued: 5800, closingStock: 2100, reorderLevel: 2000, isLow: false },
  { materialName: "Wire-cut Bricks", unit: "nos", openingStock: 8000, totalReceived: 15000, totalIssued: 16500, closingStock: 6500, reorderLevel: 5000, isLow: false },
  { materialName: "12mm Plywood", unit: "sheets", openingStock: 80, totalReceived: 40, totalIssued: 65, closingStock: 55, reorderLevel: 50, isLow: false },
];

const columns = [
  { key: "materialName" as const, label: "Material", className: "font-medium" },
  { key: "unit" as const, label: "Unit" },
  { key: "openingStock" as const, label: "Opening" },
  { key: "totalReceived" as const, label: "Received" },
  { key: "totalIssued" as const, label: "Issued" },
  {
    key: "closingStock" as const, label: "Closing",
    format: (v: unknown, row: Record<string, unknown>) => (
      <span className={row.isLow ? "font-bold text-red-600" : "font-medium"}>
        {String(v)}
      </span>
    ),
  },
  { key: "reorderLevel" as const, label: "Reorder At" },
  {
    key: "isLow" as const, label: "Status",
    format: (v: unknown) => v
      ? <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">LOW</span>
      : <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">OK</span>,
  },
];

const lowItems = inventory.filter((i) => i.isLow).length;

export default function InventoryPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-500">Module 4 — GRN - usage = stock (auto-calculated)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total Materials" value={inventory.length} />
        <StatCard title="Low Stock Alerts" value={lowItems} className={lowItems > 0 ? "border-red-200 bg-red-50" : ""} />
        <StatCard title="Last Updated" value="Today" />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={inventory} />
        </CardContent>
      </Card>
    </div>
  );
}
