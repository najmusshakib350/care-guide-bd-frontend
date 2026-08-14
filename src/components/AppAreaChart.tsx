"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { PatientRegistration } from "@/types";

const chartConfig = {
  patientCount: {
    label: "Patients",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type AppAreaChartProps = {
  title?: string;
  data?: PatientRegistration[];
  isLoading?: boolean;
  isError?: boolean;
};

const AppAreaChart = ({
  title = "Total Visitors",
  data,
  isLoading,
  isError,
}: AppAreaChartProps) => {
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
          <AreaChart accessibilityLayer data={chartData}>
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
            <defs>
              <linearGradient id="fillPatients" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-patientCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-patientCount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="patientCount"
              type="natural"
              fill="url(#fillPatients)"
              fillOpacity={0.4}
              stroke="var(--color-patientCount)"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AppAreaChart;
