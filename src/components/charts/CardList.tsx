"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { DashboardStats, PatientsPerDoctor } from "@/types";

type CardListProps = {
  title: string;
  overview?: DashboardStats["overview"];
  patientsPerDoctor?: PatientsPerDoctor[];
  isLoading?: boolean;
};

const CardList = ({
  title,
  overview,
  patientsPerDoctor = [],
  isLoading,
}: CardListProps) => {
  const isTopDoctors = title === "Top Doctors";
  const topDoctors = patientsPerDoctor.slice(0, 5);

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {!isTopDoctors && overview && (
            <>
              <Card className="flex-row items-center justify-between gap-4 p-4">
                <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-blue-500/20 flex items-center justify-center text-sm font-semibold">
                  MD
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    Total Doctors
                  </CardTitle>
                  <Badge variant="secondary">Overview</Badge>
                </CardContent>
                <CardFooter className="p-0">{overview.totalDoctors}</CardFooter>
              </Card>
              <Card className="flex-row items-center justify-between gap-4 p-4">
                <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-green-500/20 flex items-center justify-center text-sm font-semibold">
                  PT
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Badge variant="secondary">Overview</Badge>
                </CardContent>
                <CardFooter className="p-0">
                  {overview.totalPatients}
                </CardFooter>
              </Card>
            </>
          )}

          {isTopDoctors &&
            (topDoctors.length > 0 ? (
              topDoctors.map((item) => (
                <Card
                  key={item.doctorId}
                  className="flex-row items-center justify-between gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                    <Image
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        item.doctorName || "Doctor",
                      )}`}
                      alt={item.doctorName || "Doctor"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <CardContent className="flex-1 p-0">
                    <CardTitle className="text-sm font-medium">
                      {item.doctorName || "Unknown Doctor"}
                    </CardTitle>
                    <Badge variant="secondary">
                      {item.specialization || "N/A"}
                    </Badge>
                  </CardContent>
                  <CardFooter className="p-0">
                    {item.patientCount} pts
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No doctor data yet.
              </p>
            ))}

          {!isTopDoctors && !overview && (
            <p className="text-sm text-muted-foreground">No stats available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CardList;
