import { Card, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const safetyLogs = [
  { logId: "SL001", date: "2024-06-09", incidentType: "near_miss", description: "Loose brick fell from 2nd floor scaffolding", location: "Block A - East", severity: "high", status: "resolved", reportedBy: "Kumar" },
  { logId: "SL002", date: "2024-06-07", incidentType: "observation", description: "Workers without safety helmets in Zone C", location: "Block A - North", severity: "medium", status: "closed", reportedBy: "Safety Officer" },
  { logId: "SL003", date: "2024-06-05", incidentType: "minor_injury", description: "Worker cut finger on rebar — first aid given", location: "1st Floor", severity: "low", status: "closed", reportedBy: "Ramesh" },
  { logId: "SL004", date: "2024-06-01", incidentType: "observation", description: "Fire extinguisher expired in site office", location: "Site Office", severity: "medium", status: "resolved", reportedBy: "Safety Officer" },
];

const columns = [
  { key: "logId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "incidentType" as const, label: "Type" },
  { key: "description" as const, label: "Description", className: "font-medium max-w-xs" },
  { key: "location" as const, label: "Location" },
  { key: "severity" as const, label: "Severity", format: (v: unknown) => <StatusBadge status={v as string} /> },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
];

export default function SafetyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Safety Log</h1>
        <p className="text-sm text-gray-500">Module 5 — Incident reporting and safety tracking</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Days Without Incident" value={32} />
        <StatCard title="Open Issues" value={0} className="border-green-200 bg-green-50" />
        <StatCard title="Near Misses (Month)" value={1} />
        <StatCard title="Safety Score" value="94%" />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={safetyLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
