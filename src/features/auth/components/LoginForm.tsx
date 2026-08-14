"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import {
  authCardClassName,
  authCardContentClassName,
  authDividerLineClassName,
  authDividerTextClassName,
  authDividerWrapperClassName,
  authFooterLinkClassName,
  authFooterTextClassName,
  authFormItemClassName,
  authHeadingClassName,
  authInputClassName,
  authLabelClassName,
  authOAuthButtonClassName,
  authSubheadingClassName,
  authSubmitButtonClassName,
} from "@/app/(auth)/auth-styles";
import { useAlert } from "@/components/ui/alerts/Alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginSchema, type LoginFormValues } from "../types/auth";

export function LoginForm() {
  const router = useRouter();
  const { showError, showSuccess } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        showError(res.error, "Login Failed");
      } else if (res?.ok) {
        showSuccess("Logged in successfully!", "Welcome");
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      showError(errorMessage, "Login Failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card suppressHydrationWarning className={authCardClassName}>
      <CardContent className={authCardContentClassName}>
        <p className={authSubheadingClassName}>Welcome back</p>
        <h1 className={authHeadingClassName}>Login to your account</h1>

        <Button
          type="button"
          variant="outline"
          className={authOAuthButtonClassName}
        >
          <Image
            src="/auth/google.svg"
            alt=""
            width={20}
            height={20}
            className="mr-2 size-5 shrink-0"
            sizes="20px"
          />
          <span className="text-sm font-medium">Or sign-in with Google</span>
        </Button>

        <div className={authDividerWrapperClassName}>
          <div className={authDividerLineClassName} />
          <span className={authDividerTextClassName}>Or</span>
          <div className={authDividerLineClassName} />
        </div>

        <Form {...form}>
          <form
            suppressHydrationWarning
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-0"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={`${authFormItemClassName} mb-4`}>
                  <FormLabel className={authLabelClassName}>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className={authInputClassName}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={`${authFormItemClassName} mb-4`}>
                  <FormLabel className={authLabelClassName}>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={authInputClassName}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 gap-2">
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        disabled={isLoading}
                        onCheckedChange={(v) => field.onChange(v === true)}
                      />
                    </FormControl>
                    <FormLabel className="mb-0 cursor-pointer text-sm font-normal text-muted-foreground">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground sm:text-right">
                Forgot password?
              </p>
            </div>

            <div className="mt-8 mb-6">
              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className={authSubmitButtonClassName}
              >
                {isLoading ? "Signing in…" : "Login now"}
              </Button>
            </div>
          </form>
        </Form>

        <p className={authFooterTextClassName}>
          Don&apos;t have an account?{" "}
          <Link href="/registration" className={authFooterLinkClassName}>
            Create New Account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
