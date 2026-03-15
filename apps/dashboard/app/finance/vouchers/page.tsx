import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";

const vouchers = [
  { voucherId: "VCH001", date: "2024-06-10", voucherType: "payment", description: "Steel purchase — PO001", debitAccount: "Steel Expenses", creditAccount: "Bank Account", amount: 518400 },
  { voucherId: "VCH002", date: "2024-06-07", voucherType: "payment", description: "Cement purchase — PO002", debitAccount: "Cement Expenses", creditAccount: "Bank Account", amount: 126000 },
  { voucherId: "VCH003", date: "2024-06-06", voucherType: "payment", description: "Weekly labor wages", debitAccount: "Labor Expenses", creditAccount: "Bank Account", amount: 245000 },
  { voucherId: "VCH004", date: "2024-06-05", voucherType: "receipt", description: "Client advance — 3rd installment", debitAccount: "Bank Account", creditAccount: "Client Advance", amount: 1500000 },
  { voucherId: "VCH005", date: "2024-06-03", voucherType: "payment", description: "Diesel + misc expenses", debitAccount: "Misc Expenses", creditAccount: "Cash Account", amount: 15000 },
];

const columns = [
  { key: "voucherId" as const, label: "Voucher #" },
  { key: "date" as const, label: "Date" },
  { key: "voucherType" as const, label: "Type" },
  { key: "description" as const, label: "Description", className: "font-medium" },
  { key: "debitAccount" as const, label: "Debit" },
  { key: "creditAccount" as const, label: "Credit" },
  { key: "amount" as const, label: "Amount", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
];

export default function VouchersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Voucher Register</h1>
        <p className="text-sm text-gray-500">Module 6 — Audit trail for all financial entries</p>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={vouchers} />
        </CardContent>
      </Card>
    </div>
  );
}
