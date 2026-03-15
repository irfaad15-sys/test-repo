import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const purchaseOrders = [
  { poId: "PO001", vendorId: "V002", vendorName: "TATA Steel", poDate: "2024-06-01", expectedDelivery: "2024-06-10", totalAmount: 518400, status: "completed" },
  { poId: "PO002", vendorId: "V001", vendorName: "ACC Cement", poDate: "2024-06-05", expectedDelivery: "2024-06-08", totalAmount: 126000, status: "completed" },
  { poId: "PO003", vendorId: "V003", vendorName: "Rock Aggregates", poDate: "2024-06-08", expectedDelivery: "2024-06-12", totalAmount: 85000, status: "partial_received" },
  { poId: "PO004", vendorId: "V002", vendorName: "TATA Steel", poDate: "2024-06-10", expectedDelivery: "2024-06-18", totalAmount: 432000, status: "sent" },
  { poId: "PO005", vendorId: "V004", vendorName: "Chennai Bricks", poDate: "2024-06-10", expectedDelivery: "2024-06-15", totalAmount: 95000, status: "approved" },
];

const columns = [
  { key: "poId" as const, label: "PO #" },
  { key: "vendorName" as const, label: "Vendor", className: "font-medium" },
  { key: "poDate" as const, label: "PO Date" },
  { key: "expectedDelivery" as const, label: "Expected" },
  { key: "totalAmount" as const, label: "Amount", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function PurchaseOrdersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500">Module 4 — PO creation and tracking</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Create PO
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total POs" value={5} />
        <StatCard title="Open POs" value={3} />
        <StatCard title="This Month" value="₹12.6L" />
        <StatCard title="Pending Delivery" value={2} />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={purchaseOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
