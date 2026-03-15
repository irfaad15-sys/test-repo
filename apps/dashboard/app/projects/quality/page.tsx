import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const checks = [
  { checkId: "QC001", date: "2024-06-10", floor: "Ground", checkType: "concrete_cube", element: "Slab S1 - 28 day", standard: "M25 ≥ 25 MPa", observedValue: "27.3 MPa", result: "pass" },
  { checkId: "QC002", date: "2024-06-10", floor: "Ground", checkType: "concrete_cube", element: "Beam B1 - 7 day", standard: "≥ 67% of 28d", observedValue: "18.1 MPa", result: "pass" },
  { checkId: "QC003", date: "2024-06-09", floor: "1st Floor", checkType: "alignment", element: "Column C1-C6", standard: "±5mm", observedValue: "3mm offset", result: "pass" },
  { checkId: "QC004", date: "2024-06-08", floor: "Ground", checkType: "level", element: "Slab S1 top surface", standard: "±10mm", observedValue: "8mm variation", result: "pass" },
  { checkId: "QC005", date: "2024-06-07", floor: "Ground", checkType: "concrete_cube", element: "Column C7 - 7 day", standard: "≥ 67% of 28d", observedValue: "15.2 MPa", result: "fail" },
];

const columns = [
  { key: "checkId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "floor" as const, label: "Floor" },
  { key: "checkType" as const, label: "Type" },
  { key: "element" as const, label: "Element", className: "font-medium" },
  { key: "standard" as const, label: "Standard" },
  { key: "observedValue" as const, label: "Observed" },
  { key: "result" as const, label: "Result", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function QualityPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quality Checks</h1>
        <p className="text-sm text-gray-500">Module 5 — Concrete cube tests, alignment, level checks</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={checks} />
        </CardContent>
      </Card>
    </div>
  );
}
