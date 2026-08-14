"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { PatientRegistration } from "@/types";

const chartConfig = {
  patientCount: {
    label: "Patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type AppBarChartProps = {
  title?: string;
  data?: PatientRegistration[];
  isLoading?: boolean;
  isError?: boolean;
};

const AppBarChart = ({
  title = "Total Revenue",
  data,
  isLoading,
  isError,
}: AppBarChartProps) => {
  const chartData =
    data?.map((item) => ({
      month: item.date,
      patientCount: item.patientCount,
    })) ?? [];

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Failed to load chart data.</p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No registration data yet.</p>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(5)}
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="patientCount"
              fill="var(--color-patientCount)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AppBarChart;
