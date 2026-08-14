"use client";

import { Alert } from "@/components/ui/alerts/Alert";

const DashboardAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Alert>{children}</Alert>;
};

export default DashboardAlertProvider;
