import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const projects = [
  { projectId: "PRJ001", projectName: "Porur Residential Complex", clientName: "ABC Developers", location: "Porur, Chennai", totalFloors: 4, status: "in_progress", progress: 42 },
  { projectId: "PRJ002", projectName: "Vadapalani Commercial", clientName: "XYZ Corp", location: "Vadapalani, Chennai", totalFloors: 6, status: "planning", progress: 5 },
];

const columns = [
  { key: "projectId" as const, label: "ID" },
  { key: "projectName" as const, label: "Project Name", className: "font-medium" },
  { key: "clientName" as const, label: "Client" },
  { key: "location" as const, label: "Location" },
  { key: "totalFloors" as const, label: "Floors" },
  {
    key: "status" as const,
    label: "Status",
    format: (v: unknown) => <StatusBadge status={v as string} />,
  },
  {
    key: "progress" as const,
    label: "Progress",
    format: (v: unknown) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 rounded-full bg-gray-200">
          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${v}%` }} />
        </div>
        <span className="text-xs">{v}%</span>
      </div>
    ),
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Module 1 — Project Master</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + New Project
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
