import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BudgetChart } from "@/components/charts/budget-chart";
import { ProgressChart } from "@/components/charts/progress-chart";
import { AlertsList } from "@/components/tables/alerts-list";

// In production, these come from Google Sheets via readSheet()
const stats = {
  totalBudget: "₹2.4 Cr",
  spent: "₹1.1 Cr",
  progress: "42%",
  laborToday: 87,
  openPOs: 12,
  inventoryAlerts: 3,
  pendingPayments: "₹18.5L",
  qualityScore: "94%",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
        <p className="text-sm text-gray-500">All KPIs + alerts + reports</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Budget"
          value={stats.totalBudget}
          subtitle="Across all projects"
        />
        <StatCard
          title="Total Spent"
          value={stats.spent}
          subtitle="45.8% utilized"
          trend={{ value: -2.3, label: "vs last month" }}
        />
        <StatCard
          title="Overall Progress"
          value={stats.progress}
          trend={{ value: 5.2, label: "this week" }}
        />
        <StatCard
          title="Labor Today"
          value={stats.laborToday}
          subtitle="12 masons, 45 helpers, 30 others"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Open POs" value={stats.openPOs} />
        <StatCard title="Inventory Alerts" value={stats.inventoryAlerts} className={stats.inventoryAlerts > 0 ? "border-red-200 bg-red-50" : ""} />
        <StatCard title="Pending Payments" value={stats.pendingPayments} />
        <StatCard title="Quality Score" value={stats.qualityScore} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Floor-wise Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart />
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertsList />
        </CardContent>
      </Card>
    </div>
  );
}
