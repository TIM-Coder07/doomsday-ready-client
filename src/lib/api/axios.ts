import axios from "axios";
import type { ApiErrorBody } from "@/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Turns any failed request into a short message a user can read
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    if (body?.error) {
      if (body.error.code === "CIRCULAR_DEPENDENCY") {
        return "That would make a movie depend on itself. Pick different prerequisites.";
      }
      return body.error.message;
    }
    if (!error.response) {
      return "Cannot reach the server. Is the API running?";
    }
  }
  return "Something went wrong. Please try again.";
}