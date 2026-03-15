import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const vendors = [
  { vendorId: "V001", vendorName: "ACC Cement Dealers", contactPerson: "Senthil", phone: "9876543210", materialsSupplied: "Cement", paymentTerms: "30 days", rating: 4, status: "active" },
  { vendorId: "V002", vendorName: "TATA Steel Distributors", contactPerson: "Mohan", phone: "9876543211", materialsSupplied: "Steel, TMT Bars", paymentTerms: "15 days", rating: 5, status: "active" },
  { vendorId: "V003", vendorName: "Rock Aggregates", contactPerson: "Babu", phone: "9876543212", materialsSupplied: "Sand, Aggregate", paymentTerms: "Immediate", rating: 3, status: "active" },
  { vendorId: "V004", vendorName: "Chennai Bricks", contactPerson: "Lakshmi", phone: "9876543213", materialsSupplied: "Bricks", paymentTerms: "7 days", rating: 4, status: "active" },
  { vendorId: "V005", vendorName: "KP Constructions", contactPerson: "Karthik P", phone: "9876543214", materialsSupplied: "Labor Supply", paymentTerms: "Weekly", rating: 4, status: "active" },
];

const columns = [
  { key: "vendorId" as const, label: "ID" },
  { key: "vendorName" as const, label: "Vendor", className: "font-medium" },
  { key: "contactPerson" as const, label: "Contact" },
  { key: "phone" as const, label: "Phone" },
  { key: "materialsSupplied" as const, label: "Materials" },
  { key: "paymentTerms" as const, label: "Terms" },
  {
    key: "rating" as const, label: "Rating",
    format: (v: unknown) => "★".repeat(Number(v)) + "☆".repeat(5 - Number(v)),
  },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function VendorsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Master</h1>
          <p className="text-sm text-gray-500">Module 1 — Vendor database with ratings</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Add Vendor
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={vendors} />
        </CardContent>
      </Card>
    </div>
  );
}
