"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useUpdatePatientMutation } from "@/redux/api/patientApi";
import type { Patient } from "@/types";
import { getApiErrorMessage } from "@/utils/error";
import { toDateInputValue } from "@/utils/patient";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Patient name must be at least 2 characters!" }),
  age: z.coerce.number().int().min(0, { message: "Age cannot be negative" }),
  condition: z
    .string()
    .min(2, { message: "Condition must be at least 2 characters!" }),
  date: z.string().min(1, { message: "Date is required" }),
});

type EditPatientProps = {
  patient: Patient;
  onUpdated?: () => void;
};

const EditPatient = ({ patient, onUpdated }: EditPatientProps) => {
  const [updatePatient, { isLoading }] = useUpdatePatientMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      date: toDateInputValue(patient.date),
    },
  });

  useEffect(() => {
    form.reset({
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      date: toDateInputValue(patient.date),
    });
  }, [patient, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);

    try {
      await updatePatient({
        patientId: patient._id,
        body: values,
      }).unwrap();
      setSuccess("Patient updated successfully.");
      onUpdated?.();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update patient"));
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Edit Patient</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter patient name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Enter patient age.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter patient condition.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Enter registration date.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default EditPatient;
