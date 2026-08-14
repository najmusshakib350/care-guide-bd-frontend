import type { Patient } from "@/types";

export function getPatientDoctorName(patient: Patient): string {
  if (typeof patient.doctorId === "object" && patient.doctorId !== null) {
    return patient.doctorId.name;
  }
  return "—";
}

export function formatDate(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function toDateInputValue(value?: string): string {
  return value?.slice(0, 10) ?? "";
}
