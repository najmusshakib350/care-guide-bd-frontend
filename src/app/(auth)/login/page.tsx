import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { Alert } from "@/components/ui/alerts/Alert";
import { authOptions } from "@/features/auth/api/auth-options";
import { LoginForm } from "@/features/auth/components/LoginForm";

import { AuthPageShell } from "../_components/AuthPageShell";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <AuthPageShell
      illustrationSrc="/auth/login.png"
      illustrationAlt="Doctor Tracker login illustration"
    >
      <Alert>
        <LoginForm />
      </Alert>
    </AuthPageShell>
  );
}
