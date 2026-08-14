"use client";

import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import { useGetDashboardStatsQuery } from "@/redux/api/statsApi";

const Homepage = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart
          title="Patient Registrations"
          data={stats?.patientRegistration}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList
          title="Overview"
          overview={stats?.overview}
          patientsPerDoctor={stats?.patientsPerDoctor}
          isLoading={isLoading}
        />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart
          title="Patients per Doctor"
          data={stats?.patientsPerDoctor}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart
          title="Registration Trend"
          data={stats?.patientRegistration}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2">
        <CardList
          title="Top Doctors"
          overview={stats?.overview}
          patientsPerDoctor={stats?.patientsPerDoctor}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Homepage;
