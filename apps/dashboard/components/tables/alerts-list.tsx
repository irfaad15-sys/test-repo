"use client";

import { cn } from "@/lib/utils";

const alerts = [
  { id: "1", type: "inventory", severity: "critical", message: "Cement stock below reorder level — only 45 bags remaining", time: "10 mins ago" },
  { id: "2", type: "budget", severity: "warning", message: "Steel category at 92% budget utilization", time: "2 hours ago" },
  { id: "3", type: "schedule", severity: "warning", message: "2nd floor slab casting delayed by 3 days", time: "5 hours ago" },
  { id: "4", type: "safety", severity: "critical", message: "Near miss reported at Block B scaffolding", time: "1 day ago" },
  { id: "5", type: "quality", severity: "info", message: "7-day cube test results ready for review", time: "1 day ago" },
  { id: "6", type: "payment", severity: "warning", message: "3 vendor payments overdue (>30 days)", time: "2 days ago" },
];

const severityStyles: Record<string, string> = {
  critical: "border-l-red-500 bg-red-50",
  warning: "border-l-yellow-500 bg-yellow-50",
  info: "border-l-blue-500 bg-blue-50",
};

const typeBadge: Record<string, string> = {
  inventory: "bg-teal-100 text-teal-800",
  budget: "bg-green-100 text-green-800",
  schedule: "bg-blue-100 text-blue-800",
  safety: "bg-red-100 text-red-800",
  quality: "bg-purple-100 text-purple-800",
  payment: "bg-orange-100 text-orange-800",
};

export function AlertsList() {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "flex items-center justify-between rounded-lg border-l-4 p-4",
            severityStyles[alert.severity]
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                typeBadge[alert.type]
              )}
            >
              {alert.type}
            </span>
            <p className="text-sm text-gray-800">{alert.message}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{alert.time}</span>
        </div>
      ))}
    </div>
  );
}
