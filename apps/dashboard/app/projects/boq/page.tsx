import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const boqData = [
  { boqId: "BOQ001", category: "Concrete", item: "M25 Grade Concrete", unit: "cum", quantity: 450, rate: 6500, amount: 2925000, floor: "All Floors" },
  { boqId: "BOQ002", category: "Steel", item: "Fe500D TMT Bars", unit: "kg", quantity: 45000, rate: 72, amount: 3240000, floor: "All Floors" },
  { boqId: "BOQ003", category: "Brickwork", item: "9 inch Brick Wall", unit: "sqft", quantity: 12000, rate: 85, amount: 1020000, floor: "All Floors" },
  { boqId: "BOQ004", category: "Plastering", item: "Internal 12mm", unit: "sqft", quantity: 28000, rate: 35, amount: 980000, floor: "All Floors" },
  { boqId: "BOQ005", category: "Formwork", item: "Plywood Formwork", unit: "sqft", quantity: 8000, rate: 55, amount: 440000, floor: "All Floors" },
  { boqId: "BOQ006", category: "Plumbing", item: "Internal Plumbing", unit: "point", quantity: 120, rate: 3500, amount: 420000, floor: "All Floors" },
  { boqId: "BOQ007", category: "Electrical", item: "Internal Wiring", unit: "point", quantity: 200, rate: 2800, amount: 560000, floor: "All Floors" },
];

const columns = [
  { key: "boqId" as const, label: "ID" },
  { key: "category" as const, label: "Category" },
  { key: "item" as const, label: "Item", className: "font-medium" },
  { key: "unit" as const, label: "Unit" },
  { key: "quantity" as const, label: "Qty", format: (v: unknown) => Number(v).toLocaleString("en-IN") },
  { key: "rate" as const, label: "Rate (₹)", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}` },
  { key: "amount" as const, label: "Amount (₹)", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
  { key: "floor" as const, label: "Floor" },
];

const totalBudget = boqData.reduce((sum, row) => sum + row.amount, 0);

export default function BOQPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">BOQ Budget</h1>
        <p className="text-sm text-gray-500">Module 1 — Bill of Quantities with rate lookup</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total BOQ Budget" value={`₹${(totalBudget / 100000).toFixed(1)}L`} />
        <StatCard title="Line Items" value={boqData.length} />
        <StatCard title="Categories" value={new Set(boqData.map((b) => b.category)).size} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bill of Quantities</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={boqData} />
        </CardContent>
      </Card>
    </div>
  );
}
