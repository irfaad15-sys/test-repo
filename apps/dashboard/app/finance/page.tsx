import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const expenses = [
  { expenseId: "EXP001", date: "2024-06-10", category: "Steel", vendorId: "V002", description: "TMT 16mm — 7200 kg", amount: 518400, paymentMode: "bank_transfer", billNumber: "TS/2024/1456" },
  { expenseId: "EXP002", date: "2024-06-07", category: "Cement", vendorId: "V001", description: "OPC 53 — 300 bags", amount: 126000, paymentMode: "cheque", billNumber: "ACC/24/7890" },
  { expenseId: "EXP003", date: "2024-06-06", category: "Labor", vendorId: "V005", description: "Weekly wages — Week 23", amount: 245000, paymentMode: "bank_transfer", billNumber: "KP/W23" },
  { expenseId: "EXP004", date: "2024-06-05", category: "Aggregate", vendorId: "V003", description: "20mm aggregate — 1200 cft", amount: 52000, paymentMode: "upi", billNumber: "RA/24/345" },
  { expenseId: "EXP005", date: "2024-06-03", category: "Misc", vendorId: "-", description: "Diesel for DG set + equipment", amount: 15000, paymentMode: "cash", billNumber: "CASH/0603" },
  { expenseId: "EXP006", date: "2024-06-01", category: "Equipment", vendorId: "-", description: "Tower crane monthly rent", amount: 240000, paymentMode: "bank_transfer", billNumber: "CR/JUN24" },
];

const columns = [
  { key: "expenseId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "category" as const, label: "Category" },
  { key: "description" as const, label: "Description", className: "font-medium" },
  { key: "amount" as const, label: "Amount", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
  { key: "paymentMode" as const, label: "Mode" },
  { key: "billNumber" as const, label: "Bill #" },
];

const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

export default function FinancePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Log</h1>
          <p className="text-sm text-gray-500">Module 6 — All expenses with bill tracking</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total Expenses" value={`₹${(totalExpenses / 100000).toFixed(1)}L`} subtitle="This month" />
        <StatCard title="Transactions" value={expenses.length} />
        <StatCard title="Largest Expense" value="₹5.2L" subtitle="Steel purchase" />
        <StatCard title="Cash Payments" value="₹15K" />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
