import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BudgetChart } from "@/components/charts/budget-chart";
import { CashFlowChart } from "@/components/charts/cashflow-chart";

export default function FinanceReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-sm text-gray-500">Module 7 — Complete financial overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Budget" value="₹2.4 Cr" />
        <StatCard title="Total Spent" value="₹1.1 Cr" subtitle="45.8% utilized" />
        <StatCard title="Committed" value="₹13.6L" subtitle="Approved POs" />
        <StatCard title="Available" value="₹1.2 Cr" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Cash in Hand" value="₹18.4L" />
        <StatCard title="Receivables" value="₹45L" subtitle="Next client installment" />
        <StatCard title="Payables" value="₹7.98L" />
        <StatCard title="Monthly Burn" value="₹12L/month" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Budget vs Actual by Category</CardTitle></CardHeader>
          <CardContent><BudgetChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cash Flow Trend</CardTitle></CardHeader>
          <CardContent><CashFlowChart /></CardContent>
        </Card>
      </div>
    </div>
  );
}
