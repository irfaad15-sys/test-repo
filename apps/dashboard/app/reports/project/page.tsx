import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const criticalTasks = [
  { task: "1st Floor slab casting", deadline: "2024-06-20", status: "in_progress", daysRemaining: 10 },
  { task: "GF brickwork completion", deadline: "2024-06-15", status: "in_progress", daysRemaining: 5 },
  { task: "2nd Floor column rebar", deadline: "2024-07-05", status: "not_started", daysRemaining: 25 },
  { task: "Plumbing rough-in GF", deadline: "2024-06-25", status: "in_progress", daysRemaining: 15 },
];

const milestones = [
  { milestone: "Foundation Complete", planned: "2024-03-15", actual: "2024-03-14", status: "completed" },
  { milestone: "GF Structure", planned: "2024-05-30", actual: "—", status: "in_progress" },
  { milestone: "1st Floor Structure", planned: "2024-07-30", actual: "—", status: "not_started" },
  { milestone: "2nd Floor Structure", planned: "2024-09-30", actual: "—", status: "not_started" },
  { milestone: "Project Handover", planned: "2024-12-31", actual: "—", status: "not_started" },
];

export default function ProjectReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
        <p className="text-sm text-gray-500">Module 7 — Progress tracking and milestones</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Overall Progress" value="42%" />
        <StatCard title="Tasks Completed" value="24/58" />
        <StatCard title="Delayed Tasks" value={3} className="border-red-200 bg-red-50" />
        <StatCard title="Resource Utilization" value="78%" />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Floor-wise Progress</CardTitle></CardHeader>
        <CardContent><ProgressChart /></CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Critical Tasks</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalTasks.map((t, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="text-sm font-medium">{t.task}</p>
                    <p className="text-xs text-gray-500">Due: {t.deadline}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={t.status} />
                    <p className="text-xs text-gray-500 mt-1">{t.daysRemaining} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="text-sm font-medium">{m.milestone}</p>
                    <p className="text-xs text-gray-500">Planned: {m.planned}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
