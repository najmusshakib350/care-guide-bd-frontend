"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { registerUser } from "../api/auth.api";
import { registrationSchema, type RegistrationFormValues } from "../types/auth";

const defaultFormValues: RegistrationFormValues = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
};

export function RegistrationForm() {
  const { showSuccess, showError } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: defaultFormValues,
  });

  async function onSubmit(values: RegistrationFormValues) {
    setIsLoading(true);
    try {
      const res = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (res.success) {
        showSuccess(
          res.message || "Registration successful! Please login to continue.",
          "Success"
        );
        form.reset(defaultFormValues);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      showError(errorMessage, "Registration Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card suppressHydrationWarning className={authCardClassName}>
      <CardContent className={authCardContentClassName}>
        <p className={authSubheadingClassName}>Get Started Now</p>
        <h1 className={authHeadingClassName}>Registration</h1>

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
          <span className="text-sm font-medium">Register with Google</span>
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
              name="name"
              render={({ field }) => (
                <FormItem className={`${authFormItemClassName} mb-4`}>
                  <FormLabel className={authLabelClassName}>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
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
                      autoComplete="new-password"
                      placeholder="Create a password"
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
              name="repeatPassword"
              render={({ field }) => (
                <FormItem className={`${authFormItemClassName} mb-4`}>
                  <FormLabel className={authLabelClassName}>
                    Repeat Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className={authInputClassName}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-8 mb-6">
              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className={authSubmitButtonClassName}
              >
                {isLoading ? "Please wait…" : "Register now"}
              </Button>
            </div>
          </form>
        </Form>

        <p className={authFooterTextClassName}>
          Already have an account?{" "}
          <Link href="/login" className={authFooterLinkClassName}>
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
