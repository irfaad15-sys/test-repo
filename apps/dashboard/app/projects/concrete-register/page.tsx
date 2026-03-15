import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const concreteEntries = [
  { registerId: "CR001", date: "2024-06-10", floor: "1st Floor", element: "Column C1-C6", grade: "M25", volume: 4.8, batchCount: 8, startTime: "07:00", endTime: "11:30", slumpValue: 120, cubesCast: 6 },
  { registerId: "CR002", date: "2024-06-08", floor: "Ground", element: "Slab S1", grade: "M25", volume: 28.5, batchCount: 48, startTime: "06:00", endTime: "16:00", slumpValue: 115, cubesCast: 18 },
  { registerId: "CR003", date: "2024-06-05", floor: "Ground", element: "Beam B1-B8", grade: "M30", volume: 12.2, batchCount: 20, startTime: "07:00", endTime: "13:00", slumpValue: 125, cubesCast: 9 },
  { registerId: "CR004", date: "2024-06-01", floor: "Ground", element: "Column C1-C12", grade: "M25", volume: 9.6, batchCount: 16, startTime: "07:00", endTime: "14:00", slumpValue: 118, cubesCast: 6 },
];

const columns = [
  { key: "registerId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "floor" as const, label: "Floor" },
  { key: "element" as const, label: "Element", className: "font-medium" },
  { key: "grade" as const, label: "Grade" },
  { key: "volume" as const, label: "Volume (cum)", format: (v: unknown) => `${v} cum` },
  { key: "batchCount" as const, label: "Batches" },
  { key: "startTime" as const, label: "Start" },
  { key: "endTime" as const, label: "End" },
  { key: "slumpValue" as const, label: "Slump (mm)" },
  { key: "cubesCast" as const, label: "Cubes" },
];

export default function ConcreteRegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Concrete Register</h1>
        <p className="text-sm text-gray-500">Module 5 — Concrete pouring log with cube tracking</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={concreteEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
