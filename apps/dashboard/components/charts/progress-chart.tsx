"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { floor: "Foundation", percent: 100, status: "completed" },
  { floor: "Ground", percent: 85, status: "in_progress" },
  { floor: "1st Floor", percent: 60, status: "in_progress" },
  { floor: "2nd Floor", percent: 30, status: "in_progress" },
  { floor: "3rd Floor", percent: 5, status: "in_progress" },
  { floor: "Terrace", percent: 0, status: "not_started" },
];

const COLORS: Record<string, string> = {
  completed: "#22c55e",
  in_progress: "#3b82f6",
  not_started: "#d1d5db",
};

export function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} />
        <YAxis type="category" dataKey="floor" fontSize={12} width={80} />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Bar dataKey="percent" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
