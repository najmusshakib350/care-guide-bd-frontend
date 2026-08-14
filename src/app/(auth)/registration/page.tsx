import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { Alert } from "@/components/ui/alerts/Alert";
import { authOptions } from "@/features/auth/api/auth-options";
import { RegistrationForm } from "@/features/auth/components/RegistrationForm";

import { AuthPageShell } from "../_components/AuthPageShell";

export default async function RegistrationPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <AuthPageShell
      illustrationSrc="/auth/registration.png"
      illustrationAlt="Doctor Tracker registration illustration"
    >
      <Alert>
        <RegistrationForm />
      </Alert>
    </AuthPageShell>
  );
}
