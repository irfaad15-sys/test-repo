"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jun 1", balance: 2800000 },
  { date: "Jun 3", balance: 2785000 },
  { date: "Jun 5", balance: 2733000 },
  { date: "Jun 6", balance: 2488000 },
  { date: "Jun 7", balance: 2362000 },
  { date: "Jun 10", balance: 1843600 },
  { date: "Jun 13", balance: 1750000 },
  { date: "Jun 15", balance: 3100000 },
  { date: "Jun 20", balance: 2650000 },
  { date: "Jun 25", balance: 2200000 },
  { date: "Jun 30", balance: 1900000 },
];

export function CashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#16a34a"
          fill="#dcfce7"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
