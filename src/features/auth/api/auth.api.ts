import axios from "axios";
import { api } from "@/lib/axios";
import {
  RegisterPayload,
  RegisterSuccessResponse,
  LoginPayload,
} from "../types/auth";

// Register API
export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterSuccessResponse> {
  try {
    const response = await api.post<RegisterSuccessResponse>(
      "/auth/register",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errData = error.response.data;
      if (
        errData.errors &&
        Array.isArray(errData.errors) &&
        errData.errors.length > 0
      ) {
        throw new Error(errData.errors[0].message);
      }
      throw new Error(errData.message || "Registration failed");
    }
    throw new Error("Something went wrong. Please try again.");
  }
}

// Login API - ekhane access_token return kora hocche
export async function loginUser(payload: LoginPayload) {
  try {
    const response = await api.post("/auth/login", payload);

    const resData = response.data;

    // Backend er response format dictionary/object hoy
    return {
      access_token: resData.data?.token || resData.token,
      user: resData.data?.user || resData.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const errData = error.response.data;
      if (
        errData.errors &&
        Array.isArray(errData.errors) &&
        errData.errors.length > 0
      ) {
        throw new Error(errData.errors[0].message);
      }
      throw new Error(errData.message || "Login failed");
    }
    throw new Error("Invalid credentials or server error");
  }
}
