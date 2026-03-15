import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ title, value, subtitle, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-6 shadow-sm", className)}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      {trend && (
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
