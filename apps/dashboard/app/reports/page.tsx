import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BudgetChart } from "@/components/charts/budget-chart";
import { ProgressChart } from "@/components/charts/progress-chart";
import { CashFlowChart } from "@/components/charts/cashflow-chart";
import { AlertsList } from "@/components/tables/alerts-list";

export default function MasterReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
        <p className="text-sm text-gray-500">Module 7 — All KPIs + alerts + reports</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard title="Overall Progress" value="42%" trend={{ value: 5.2, label: "this week" }} />
        <StatCard title="Budget Health" value="On Track" subtitle="45.8% utilized" />
        <StatCard title="Schedule" value="-3 days" subtitle="Behind schedule" />
        <StatCard title="Quality Score" value="94%" />
        <StatCard title="Safety Score" value="98%" subtitle="32 days no incident" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader>
          <CardContent><BudgetChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Floor Progress</CardTitle></CardHeader>
          <CardContent><ProgressChart /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle>Cash Flow</CardTitle></CardHeader>
          <CardContent><CashFlowChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
          <CardContent><AlertsList /></CardContent>
        </Card>
      </div>
    </div>
  );
}
