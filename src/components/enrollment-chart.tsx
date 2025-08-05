"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const barChartData = [
  { month: "Ene", enrollments: 186 },
  { month: "Feb", enrollments: 305 },
  { month: "Mar", enrollments: 237 },
  { month: "Abr", enrollments: 273 },
  { month: "May", enrollments: 209 },
  { month: "Jun", enrollments: 214 },
];

const pieChartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
];
const COLORS = ['#FFFFFF', '#FFFFFF50'];


const chartConfig = {
  enrollments: {
    label: "Inscripciones",
    color: "hsl(var(--primary))",
  },
};

export function EnrollmentChart({type = 'bar'}: {type?: 'bar' | 'pie'}) {
    if (type === 'pie') {
        return (
            <ResponsiveContainer width="100%" height={50}>
                <PieChart>
                <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={15}
                    outerRadius={25}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                >
                    {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
        )
    }

  return (
    <ResponsiveContainer width="100%" height={50}>
      <BarChart data={barChartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
        <Bar
          dataKey="enrollments"
          fill="#FFFFFF"
          radius={[4, 4, 0, 0]}
          barSize={5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
