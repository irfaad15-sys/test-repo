import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";

const materials = [
  { materialId: "MAT001", materialName: "OPC 53 Grade Cement", category: "Cement", unit: "bag", hsnCode: "2523", gstRate: 28, reorderLevel: 100, defaultVendor: "ACC Dealers" },
  { materialId: "MAT002", materialName: "M-Sand (Manufactured Sand)", category: "Sand", unit: "cft", hsnCode: "2505", gstRate: 5, reorderLevel: 500, defaultVendor: "Rock Aggregates" },
  { materialId: "MAT003", materialName: "20mm Aggregate", category: "Aggregate", unit: "cft", hsnCode: "2517", gstRate: 5, reorderLevel: 400, defaultVendor: "Rock Aggregates" },
  { materialId: "MAT004", materialName: "Fe500D TMT 16mm", category: "Steel", unit: "kg", hsnCode: "7214", gstRate: 18, reorderLevel: 2000, defaultVendor: "TATA Steel" },
  { materialId: "MAT005", materialName: "Fe500D TMT 12mm", category: "Steel", unit: "kg", hsnCode: "7214", gstRate: 18, reorderLevel: 2000, defaultVendor: "TATA Steel" },
  { materialId: "MAT006", materialName: "Wire-cut Bricks", category: "Bricks", unit: "nos", hsnCode: "6901", gstRate: 5, reorderLevel: 5000, defaultVendor: "Chennai Bricks" },
  { materialId: "MAT007", materialName: "12mm Plywood (Shuttering)", category: "Formwork", unit: "sheet", hsnCode: "4412", gstRate: 18, reorderLevel: 50, defaultVendor: "Greenply Dealer" },
];

const columns = [
  { key: "materialId" as const, label: "ID" },
  { key: "materialName" as const, label: "Material", className: "font-medium" },
  { key: "category" as const, label: "Category" },
  { key: "unit" as const, label: "Unit" },
  { key: "hsnCode" as const, label: "HSN" },
  { key: "gstRate" as const, label: "GST %", format: (v: unknown) => `${v}%` },
  { key: "reorderLevel" as const, label: "Reorder Level" },
  { key: "defaultVendor" as const, label: "Default Vendor" },
];

export default function MaterialsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Material Master</h1>
          <p className="text-sm text-gray-500">Module 1 — Central material database with HSN/GST</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Add Material
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={materials} />
        </CardContent>
      </Card>
    </div>
  );
}
