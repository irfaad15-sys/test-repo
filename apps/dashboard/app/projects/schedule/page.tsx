import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const schedule = [
  { taskId: "T001", wbsCode: "1.0", taskName: "Foundation", floor: "Foundation", startDate: "2024-01-15", endDate: "2024-03-15", duration: 60, percentComplete: 100, status: "completed", isCriticalPath: true },
  { taskId: "T002", wbsCode: "2.0", taskName: "Ground Floor Structure", floor: "Ground", startDate: "2024-03-16", endDate: "2024-05-30", duration: 75, percentComplete: 85, status: "in_progress", isCriticalPath: true },
  { taskId: "T003", wbsCode: "2.1", taskName: "GF Column Casting", floor: "Ground", startDate: "2024-03-16", endDate: "2024-04-15", duration: 30, percentComplete: 100, status: "completed", isCriticalPath: true },
  { taskId: "T004", wbsCode: "2.2", taskName: "GF Beam & Slab", floor: "Ground", startDate: "2024-04-16", endDate: "2024-05-15", duration: 30, percentComplete: 90, status: "in_progress", isCriticalPath: true },
  { taskId: "T005", wbsCode: "2.3", taskName: "GF Brickwork", floor: "Ground", startDate: "2024-05-01", endDate: "2024-05-30", duration: 30, percentComplete: 60, status: "in_progress", isCriticalPath: false },
  { taskId: "T006", wbsCode: "3.0", taskName: "1st Floor Structure", floor: "1st Floor", startDate: "2024-05-16", endDate: "2024-07-30", duration: 75, percentComplete: 30, status: "in_progress", isCriticalPath: true },
  { taskId: "T007", wbsCode: "4.0", taskName: "2nd Floor Structure", floor: "2nd Floor", startDate: "2024-07-16", endDate: "2024-09-30", duration: 75, percentComplete: 5, status: "in_progress", isCriticalPath: true },
  { taskId: "T008", wbsCode: "5.0", taskName: "3rd Floor Structure", floor: "3rd Floor", startDate: "2024-09-16", endDate: "2024-11-30", duration: 75, percentComplete: 0, status: "not_started", isCriticalPath: true },
];

const columns = [
  { key: "wbsCode" as const, label: "WBS" },
  { key: "taskName" as const, label: "Task", className: "font-medium" },
  { key: "floor" as const, label: "Floor" },
  { key: "startDate" as const, label: "Start" },
  { key: "endDate" as const, label: "End" },
  { key: "duration" as const, label: "Days" },
  {
    key: "percentComplete" as const,
    label: "Progress",
    format: (v: unknown) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 rounded-full bg-gray-200">
          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs">{v}%</span>
      </div>
    ),
  },
  { key: "status" as const, label: "Status", format: (v: unknown) => <StatusBadge status={v as string} /> },
  {
    key: "isCriticalPath" as const,
    label: "Critical",
    format: (v: unknown) => v ? <span className="text-red-600 font-medium text-xs">YES</span> : <span className="text-gray-400 text-xs">—</span>,
  },
];

export default function SchedulePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Schedule</h1>
        <p className="text-sm text-gray-500">Module 3 — Gantt + dependencies (BOQ-based timeline)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule — Porur Residential Complex</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={schedule} />
        </CardContent>
      </Card>
    </div>
  );
}
