"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
import type { PatientsPerDoctor } from "@/types";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type AppPieChartProps = {
  title?: string;
  data?: PatientsPerDoctor[];
  isLoading?: boolean;
  isError?: boolean;
};

const AppPieChart = ({
  title = "Browser Usage",
  data,
  isLoading,
  isError,
}: AppPieChartProps) => {
  const chartData =
    data?.slice(0, 5).map((item, index) => ({
      doctor: item.doctorName || `Doctor ${index + 1}`,
      patients: item.patientCount,
      fill: chartColors[index % chartColors.length],
    })) ?? [];

  const chartConfig = {
    patients: {
      label: "Patients",
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.doctor,
        {
          label: item.doctor,
          color: chartColors[index % chartColors.length],
        },
      ]),
    ),
  } satisfies ChartConfig;

  const totalPatients = chartData.reduce((acc, curr) => acc + curr.patients, 0);

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Failed to load chart data.
        </p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No doctor patient data yet.
        </p>
      ) : (
        <>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="patients"
                nameKey="doctor"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalPatients.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Patients
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-4 flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2 font-medium leading-none">
              Top doctors by patient load{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing patient distribution across doctors
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppPieChart;
