"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { category: "Concrete", budget: 4500000, actual: 2100000 },
  { category: "Steel", budget: 6200000, actual: 3400000 },
  { category: "Brickwork", budget: 1800000, actual: 900000 },
  { category: "Plastering", budget: 1200000, actual: 400000 },
  { category: "Formwork", budget: 800000, actual: 500000 },
  { category: "Labor", budget: 5000000, actual: 2300000 },
  { category: "Others", budget: 4500000, actual: 1400000 },
];

export function BudgetChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" fontSize={12} />
        <YAxis
          fontSize={12}
          tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
        />
        <Tooltip
          formatter={(value: number) =>
            `₹${(value / 100000).toFixed(1)}L`
          }
        />
        <Legend />
        <Bar dataKey="budget" fill="#94a3b8" name="Budget" />
        <Bar dataKey="actual" fill="#f59e0b" name="Actual" />
      </BarChart>
    </ResponsiveContainer>
  );
}
