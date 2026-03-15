import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const grnEntries = [
  { grnId: "GRN001", poId: "PO001", vendorName: "TATA Steel", receivedDate: "2024-06-09", invoiceNumber: "TS/2024/1456", invoiceAmount: 518400, vehicleNumber: "TN 09 AB 1234", qualityCheck: "pass" },
  { grnId: "GRN002", poId: "PO002", vendorName: "ACC Cement", receivedDate: "2024-06-07", invoiceNumber: "ACC/24/7890", invoiceAmount: 126000, vehicleNumber: "TN 01 CD 5678", qualityCheck: "pass" },
  { grnId: "GRN003", poId: "PO003", vendorName: "Rock Aggregates", receivedDate: "2024-06-11", invoiceNumber: "RA/24/345", invoiceAmount: 52000, vehicleNumber: "TN 07 EF 9012", qualityCheck: "pass" },
];

const columns = [
  { key: "grnId" as const, label: "GRN #" },
  { key: "poId" as const, label: "PO #" },
  { key: "vendorName" as const, label: "Vendor", className: "font-medium" },
  { key: "receivedDate" as const, label: "Received" },
  { key: "invoiceNumber" as const, label: "Invoice #" },
  { key: "invoiceAmount" as const, label: "Amount", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}` },
  { key: "vehicleNumber" as const, label: "Vehicle" },
  { key: "qualityCheck" as const, label: "QC", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function GRNPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GRN / Delivery</h1>
          <p className="text-sm text-gray-500">Module 4 — Goods received notes with quality check</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Log GRN
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={grnEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
