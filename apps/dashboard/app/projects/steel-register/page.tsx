import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";

const steelEntries = [
  { registerId: "SR001", date: "2024-06-10", floor: "1st Floor", element: "Column C1-C6", barDiameter: 16, cutLength: 3.5, numberOfPieces: 48, totalWeight: 264.2 },
  { registerId: "SR002", date: "2024-06-10", floor: "1st Floor", element: "Column C1-C6", barDiameter: 12, cutLength: 3.5, numberOfPieces: 96, totalWeight: 297.3 },
  { registerId: "SR003", date: "2024-06-10", floor: "1st Floor", element: "Column Stirrups", barDiameter: 8, cutLength: 1.2, numberOfPieces: 240, totalWeight: 113.8 },
  { registerId: "SR004", date: "2024-06-09", floor: "Ground", element: "Beam B1-B8", barDiameter: 20, cutLength: 5.0, numberOfPieces: 32, totalWeight: 394.6 },
  { registerId: "SR005", date: "2024-06-09", floor: "Ground", element: "Slab Mesh", barDiameter: 10, cutLength: 6.0, numberOfPieces: 180, totalWeight: 665.9 },
];

const columns = [
  { key: "registerId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "floor" as const, label: "Floor" },
  { key: "element" as const, label: "Element", className: "font-medium" },
  { key: "barDiameter" as const, label: "Dia (mm)" },
  { key: "cutLength" as const, label: "Cut Length (m)" },
  { key: "numberOfPieces" as const, label: "Pieces" },
  { key: "totalWeight" as const, label: "Weight (kg)", format: (v: unknown) => `${Number(v).toFixed(1)} kg`, className: "font-medium" },
];

export default function SteelRegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Steel Register</h1>
        <p className="text-sm text-gray-500">Module 5 — Daily steel issue and usage tracking</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={steelEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
