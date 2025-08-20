
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";
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

const ageData = [
    { age: '19', value: 20 },
    { age: '20', value: 35 },
    { age: '21', value: 30 },
    { age: '22', value: 45 },
    { age: '23', value: 40 },
    { age: '24', value: 55 },
    { age: '25', value: 50 },
    { age: '26', value: 65 },
    { age: '27', value: 60 },
]


export function EnrollmentChart({type = 'area', chartValue}: {type?: 'bar' | 'pie' | 'area', chartValue?: number}) {
    if (type === 'pie' && chartValue) {
        const pieChartData = [
            { name: 'Completed', value: chartValue },
            { name: 'Remaining', value: 100 - chartValue },
        ];
        const COLORS = ['currentColor', 'hsl(var(--border))'];

        return (
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        <linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius="70%"
                        outerRadius="85%"
                        dataKey="value"
                        stroke="none"
                        cornerRadius={50}
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        )
    }

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                <Bar
                dataKey="enrollments"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                barSize={20}
                />
            </BarChart>
            </ResponsiveContainer>
        );
    }


  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={ageData}
          margin={{
            top: 5,
            right: 10,
            left: -30,
            bottom: 0,
          }}
        >
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="age" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip 
             cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}
             contentStyle={{
                 backgroundColor: 'hsl(var(--card))',
                 borderColor: 'hsl(var(--border))',
                 color: 'hsl(var(--card-foreground))'
             }}
          />
          <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorUv)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
  )
}
