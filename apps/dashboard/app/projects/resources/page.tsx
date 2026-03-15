import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const resources = [
  { resourceId: "R001", resourceType: "labor", resourceName: "Masons", quantity: 12, unit: "nos", startDate: "2024-06-01", endDate: "2024-06-30", dailyRate: 800, totalCost: 288000 },
  { resourceId: "R002", resourceType: "labor", resourceName: "Helpers", quantity: 25, unit: "nos", startDate: "2024-06-01", endDate: "2024-06-30", dailyRate: 500, totalCost: 375000 },
  { resourceId: "R003", resourceType: "labor", resourceName: "Carpenters", quantity: 6, unit: "nos", startDate: "2024-06-01", endDate: "2024-06-15", dailyRate: 900, totalCost: 81000 },
  { resourceId: "R004", resourceType: "labor", resourceName: "Bar Benders", quantity: 8, unit: "nos", startDate: "2024-06-10", endDate: "2024-06-25", dailyRate: 850, totalCost: 108800 },
  { resourceId: "R005", resourceType: "equipment", resourceName: "Concrete Mixer", quantity: 2, unit: "nos", startDate: "2024-06-01", endDate: "2024-06-30", dailyRate: 1500, totalCost: 90000 },
  { resourceId: "R006", resourceType: "equipment", resourceName: "Tower Crane", quantity: 1, unit: "nos", startDate: "2024-06-01", endDate: "2024-09-30", dailyRate: 8000, totalCost: 976000 },
];

const columns = [
  { key: "resourceId" as const, label: "ID" },
  { key: "resourceType" as const, label: "Type" },
  { key: "resourceName" as const, label: "Resource", className: "font-medium" },
  { key: "quantity" as const, label: "Qty" },
  { key: "startDate" as const, label: "Start" },
  { key: "endDate" as const, label: "End" },
  { key: "dailyRate" as const, label: "Daily Rate", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}` },
  { key: "totalCost" as const, label: "Total Cost", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
];

export default function ResourcesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resource Plan</h1>
        <p className="text-sm text-gray-500">Module 3 — Labor and equipment allocation</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total Labor" value={51} subtitle="Active this month" />
        <StatCard title="Equipment" value={3} subtitle="On site" />
        <StatCard title="Monthly Cost" value="₹19.2L" />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={resources} />
        </CardContent>
      </Card>
    </div>
  );
}
