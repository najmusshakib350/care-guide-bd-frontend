import { z } from "zod";

// --- LOGIN SCHEMAS & TYPES ---
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: boolean;
  message?: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

// --- REGISTRATION SCHEMAS & TYPES ---
export const registrationSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string(),
    // agreeToTerms এখান থেকে রিমুভ করা হয়েছে
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterSuccessResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
