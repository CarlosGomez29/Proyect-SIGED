"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Ene", enrollments: 186 },
  { month: "Feb", enrollments: 305 },
  { month: "Mar", enrollments: 237 },
  { month: "Abr", enrollments: 273 },
  { month: "May", enrollments: 209 },
  { month: "Jun", enrollments: 214 },
];

const chartConfig = {
  enrollments: {
    label: "Inscripciones",
    color: "hsl(var(--primary))",
  },
};

export function EnrollmentChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="enrollments"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
