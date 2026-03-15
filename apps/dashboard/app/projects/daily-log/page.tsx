import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";

const logs = [
  { logId: "DL001", date: "2024-06-10", floor: "1st Floor", weather: "sunny", workDescription: "Column casting C1-C6, rebar for C7-C12", laborCount: 87, loggedBy: "Ramesh" },
  { logId: "DL002", date: "2024-06-09", floor: "Ground", weather: "cloudy", workDescription: "Brickwork east wall, plastering south wall", laborCount: 82, loggedBy: "Ramesh" },
  { logId: "DL003", date: "2024-06-08", floor: "1st Floor", weather: "sunny", workDescription: "Slab formwork installation, beam rebar tying", laborCount: 91, loggedBy: "Kumar" },
  { logId: "DL004", date: "2024-06-07", floor: "Ground", weather: "rainy", workDescription: "Internal plumbing rough-in, electrical conduit", laborCount: 45, loggedBy: "Ramesh" },
  { logId: "DL005", date: "2024-06-06", floor: "1st Floor", weather: "sunny", workDescription: "Column formwork, starter bar placement", laborCount: 88, loggedBy: "Kumar" },
];

const columns = [
  { key: "logId" as const, label: "ID" },
  { key: "date" as const, label: "Date" },
  { key: "floor" as const, label: "Floor" },
  { key: "weather" as const, label: "Weather" },
  { key: "workDescription" as const, label: "Work Done", className: "font-medium max-w-xs truncate" },
  { key: "laborCount" as const, label: "Labor" },
  { key: "loggedBy" as const, label: "Logged By" },
];

export default function DailyLogPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Log</h1>
          <p className="text-sm text-gray-500">Module 5 — Daily field data entry</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + New Entry
        </button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
