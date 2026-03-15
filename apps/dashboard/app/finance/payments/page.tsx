import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const payments = [
  { paymentId: "PAY001", vendorName: "TATA Steel", poId: "PO001", invoiceNumber: "TS/2024/1456", invoiceAmount: 518400, paidAmount: 518400, balanceDue: 0, dueDate: "2024-06-25", status: "paid" },
  { paymentId: "PAY002", vendorName: "ACC Cement", poId: "PO002", invoiceNumber: "ACC/24/7890", invoiceAmount: 126000, paidAmount: 126000, balanceDue: 0, dueDate: "2024-07-07", status: "paid" },
  { paymentId: "PAY003", vendorName: "Rock Aggregates", poId: "PO003", invoiceNumber: "RA/24/345", invoiceAmount: 85000, paidAmount: 52000, balanceDue: 33000, dueDate: "2024-06-12", status: "partial" },
  { paymentId: "PAY004", vendorName: "TATA Steel", poId: "PO004", invoiceNumber: "TS/2024/1520", invoiceAmount: 432000, paidAmount: 0, balanceDue: 432000, dueDate: "2024-06-25", status: "pending" },
  { paymentId: "PAY005", vendorName: "KP Constructions", poId: "-", invoiceNumber: "KP/W22", invoiceAmount: 238000, paidAmount: 0, balanceDue: 238000, dueDate: "2024-06-08", status: "overdue" },
  { paymentId: "PAY006", vendorName: "Chennai Bricks", poId: "PO005", invoiceNumber: "CB/24/890", invoiceAmount: 95000, paidAmount: 0, balanceDue: 95000, dueDate: "2024-06-22", status: "pending" },
];

const columns = [
  { key: "paymentId" as const, label: "ID" },
  { key: "vendorName" as const, label: "Vendor", className: "font-medium" },
  { key: "invoiceNumber" as const, label: "Invoice #" },
  { key: "invoiceAmount" as const, label: "Invoice Amt", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}` },
  { key: "paidAmount" as const, label: "Paid", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}` },
  { key: "balanceDue" as const, label: "Due", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
  { key: "dueDate" as const, label: "Due Date" },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

const totalDue = payments.reduce((s, p) => s + p.balanceDue, 0);
const overdueCount = payments.filter((p) => p.status === "overdue").length;

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments Tracker</h1>
        <p className="text-sm text-gray-500">Module 6 — Vendor payment status</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total Payable" value={`₹${(totalDue / 100000).toFixed(1)}L`} />
        <StatCard title="Overdue" value={overdueCount} className={overdueCount > 0 ? "border-red-200 bg-red-50" : ""} />
        <StatCard title="Paid This Month" value="₹6.4L" />
        <StatCard title="Vendors" value={5} />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={payments} />
        </CardContent>
      </Card>
    </div>
  );
}
