import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";

const rates = [
  { rateId: "R001", category: "Cement", item: "OPC 53 Grade", unit: "bag", currentRate: 420, previousRate: 400, lastUpdated: "2024-06-01", vendor: "ACC Dealers", source: "vendor_quote" },
  { rateId: "R002", category: "Sand", item: "M-Sand", unit: "cft", currentRate: 45, previousRate: 42, lastUpdated: "2024-06-05", vendor: "Rock Aggregates", source: "market" },
  { rateId: "R003", category: "Aggregate", item: "20mm Crushed Stone", unit: "cft", currentRate: 38, previousRate: 35, lastUpdated: "2024-06-05", vendor: "Rock Aggregates", source: "market" },
  { rateId: "R004", category: "Steel", item: "Fe500D TMT Bars", unit: "kg", currentRate: 72, previousRate: 68, lastUpdated: "2024-06-08", vendor: "TATA Steel", source: "vendor_quote" },
  { rateId: "R005", category: "Bricks", item: "Wire-cut", unit: "nos", currentRate: 9.5, previousRate: 9.0, lastUpdated: "2024-06-01", vendor: "Chennai Bricks", source: "contract" },
  { rateId: "R006", category: "Labor", item: "Mason", unit: "day", currentRate: 800, previousRate: 750, lastUpdated: "2024-05-01", vendor: "KP Constructions", source: "contract" },
  { rateId: "R007", category: "Labor", item: "Helper", unit: "day", currentRate: 500, previousRate: 480, lastUpdated: "2024-05-01", vendor: "KP Constructions", source: "contract" },
];

const columns = [
  { key: "rateId" as const, label: "ID" },
  { key: "category" as const, label: "Category" },
  { key: "item" as const, label: "Item", className: "font-medium" },
  { key: "unit" as const, label: "Unit" },
  { key: "currentRate" as const, label: "Current Rate", format: (v: unknown) => `₹${v}` },
  { key: "previousRate" as const, label: "Previous", format: (v: unknown) => `₹${v}` },
  {
    key: "currentRate" as const, label: "Change",
    format: (v: unknown, row: Record<string, unknown>) => {
      const change = Number(row.currentRate) - Number(row.previousRate);
      const pct = ((change / Number(row.previousRate)) * 100).toFixed(1);
      return <span className={change > 0 ? "text-red-600" : "text-green-600"}>{change > 0 ? "+" : ""}{pct}%</span>;
    },
  },
  { key: "lastUpdated" as const, label: "Updated" },
  { key: "source" as const, label: "Source" },
];

export default function RatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rate Master</h1>
        <p className="text-sm text-gray-500">Module 1 — Current market rates with history tracking</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={rates} />
        </CardContent>
      </Card>
    </div>
  );
}
