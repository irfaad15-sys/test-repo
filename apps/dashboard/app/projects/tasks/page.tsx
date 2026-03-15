import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable, StatusBadge } from "@/components/tables/data-table";

const tasks = [
  { taskId: "TT001", date: "2024-06-10", taskDescription: "Complete GF slab shuttering removal", assignedTo: "Ramesh", priority: "high", status: "completed" },
  { taskId: "TT002", date: "2024-06-10", taskDescription: "1st floor column rebar tying", assignedTo: "Kumar", priority: "critical", status: "in_progress" },
  { taskId: "TT003", date: "2024-06-10", taskDescription: "Order 20mm aggregate — 2 lorry loads", assignedTo: "Suresh", priority: "high", status: "pending" },
  { taskId: "TT004", date: "2024-06-11", taskDescription: "GF brickwork east wall completion", assignedTo: "Rajan", priority: "medium", status: "in_progress" },
  { taskId: "TT005", date: "2024-06-11", taskDescription: "Electrical conduit placement GF", assignedTo: "Vijay", priority: "medium", status: "pending" },
  { taskId: "TT006", date: "2024-06-12", taskDescription: "Concrete cube testing — 28 day", assignedTo: "Lab", priority: "high", status: "pending" },
];

const columns = [
  { key: "taskId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "taskDescription" as const, label: "Task", className: "font-medium" },
  { key: "assignedTo" as const, label: "Assigned To" },
  {
    key: "priority" as const,
    label: "Priority",
    format: (v: unknown) => <StatusBadge status={v as string} />,
  },
  {
    key: "status" as const,
    label: "Status",
    format: (v: unknown) => <StatusBadge status={v as string} />,
  },
];

export default function TasksPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
          <p className="text-sm text-gray-500">Module 3 — Daily/weekly task management</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Add Task
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={tasks} />
        </CardContent>
      </Card>
    </div>
  );
}
