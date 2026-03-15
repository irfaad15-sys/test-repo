import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { StatCard } from "@/components/ui/stat-card";

const attendance = [
  { attendanceId: "LA001", date: "2024-06-10", laborName: "Murugan", category: "mason", contractorName: "KP Constructions", present: true, overtime: 2, dailyWage: 800, totalWage: 1000 },
  { attendanceId: "LA002", date: "2024-06-10", laborName: "Selvam", category: "mason", contractorName: "KP Constructions", present: true, overtime: 0, dailyWage: 800, totalWage: 800 },
  { attendanceId: "LA003", date: "2024-06-10", laborName: "Ravi", category: "helper", contractorName: "KP Constructions", present: true, overtime: 1, dailyWage: 500, totalWage: 563 },
  { attendanceId: "LA004", date: "2024-06-10", laborName: "Karthik", category: "bar_bender", contractorName: "Steel Works Ltd", present: true, overtime: 3, dailyWage: 850, totalWage: 1169 },
  { attendanceId: "LA005", date: "2024-06-10", laborName: "Prakash", category: "carpenter", contractorName: "Wood Masters", present: false, overtime: 0, dailyWage: 900, totalWage: 0 },
];

const columns = [
  { key: "date" as const, label: "Date" },
  { key: "laborName" as const, label: "Name", className: "font-medium" },
  { key: "category" as const, label: "Category" },
  { key: "contractorName" as const, label: "Contractor" },
  { key: "present" as const, label: "Present", format: (v: unknown) => v ? "Yes" : "Absent" },
  { key: "overtime" as const, label: "OT (hrs)" },
  { key: "dailyWage" as const, label: "Daily Wage", format: (v: unknown) => `₹${v}` },
  { key: "totalWage" as const, label: "Total", format: (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`, className: "font-medium" },
];

export default function LaborPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Labor Attendance</h1>
        <p className="text-sm text-gray-500">Module 5 — Daily attendance and wage tracking</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <StatCard title="Present Today" value={4} subtitle="out of 5" />
        <StatCard title="Total Wages" value="₹3,532" subtitle="Today" />
        <StatCard title="Overtime Hours" value={6} />
        <StatCard title="Contractors" value={3} />
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={attendance} />
        </CardContent>
      </Card>
    </div>
  );
}
