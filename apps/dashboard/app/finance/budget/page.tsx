import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { BudgetChart } from "@/components/charts/budget-chart";

const budgetData = [
  { category: "Concrete", boqBudget: 4500000, actualSpent: 2100000, committed: 350000, variance: 2050000, variancePercent: 45.6, status: "under_budget" },
  { category: "Steel", boqBudget: 6200000, actualSpent: 3400000, committed: 432000, variance: 2368000, variancePercent: 38.2, status: "under_budget" },
  { category: "Brickwork", boqBudget: 1800000, actualSpent: 900000, committed: 95000, variance: 805000, variancePercent: 44.7, status: "under_budget" },
  { category: "Plastering", boqBudget: 1200000, actualSpent: 400000, committed: 0, variance: 800000, variancePercent: 66.7, status: "under_budget" },
  { category: "Labor", boqBudget: 5000000, actualSpent: 2300000, committed: 245000, variance: 2455000, variancePercent: 49.1, status: "under_budget" },
  { category: "Formwork", boqBudget: 800000, actualSpent: 500000, committed: 0, variance: 300000, variancePercent: 37.5, status: "on_track" },
  { category: "Equipment", boqBudget: 2000000, actualSpent: 1680000, committed: 240000, variance: 80000, variancePercent: 4.0, status: "on_track" },
  { category: "Miscellaneous", boqBudget: 2500000, actualSpent: 720000, committed: 0, variance: 1780000, variancePercent: 71.2, status: "under_budget" },
];

const totalBudget = budgetData.reduce((s, b) => s + b.boqBudget, 0);
const totalSpent = budgetData.reduce((s, b) => s + b.actualSpent, 0);
const totalCommitted = budgetData.reduce((s, b) => s + b.committed, 0);

const columns = [
  { key: "category" as const, label: "Category", className: "font-medium" },
  { key: "boqBudget" as const, label: "Budget", format: (v: unknown) => `₹${(Number(v) / 100000).toFixed(1)}L` },
  { key: "actualSpent" as const, label: "Spent", format: (v: unknown) => `₹${(Number(v) / 100000).toFixed(1)}L` },
  { key: "committed" as const, label: "Committed", format: (v: unknown) => `₹${(Number(v) / 100000).toFixed(1)}L` },
  { key: "variance" as const, label: "Variance", format: (v: unknown) => `₹${(Number(v) / 100000).toFixed(1)}L` },
  { key: "variancePercent" as const, label: "Var %", format: (v: unknown) => `${v}%` },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function BudgetPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget vs Actual</h1>
        <p className="text-sm text-gray-500">Module 6 — Variance tracking by category</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Total Budget" value={`₹${(totalBudget / 10000000).toFixed(1)} Cr`} />
        <StatCard title="Total Spent" value={`₹${(totalSpent / 10000000).toFixed(1)} Cr`} />
        <StatCard title="Committed" value={`₹${(totalCommitted / 100000).toFixed(1)}L`} />
        <StatCard title="Available" value={`₹${((totalBudget - totalSpent - totalCommitted) / 10000000).toFixed(1)} Cr`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle>Budget vs Actual Chart</CardTitle></CardHeader>
          <CardContent><BudgetChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Utilization Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetData.map((b) => (
                <div key={b.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{b.category}</span>
                    <span className="text-xs text-gray-500">{((b.actualSpent / b.boqBudget) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${Math.min((b.actualSpent / b.boqBudget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={budgetData} />
        </CardContent>
      </Card>
    </div>
  );
}
