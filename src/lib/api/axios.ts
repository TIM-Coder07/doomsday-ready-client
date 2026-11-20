import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Turns any failed request into one message that can be shown to the user
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data?.error;

    if (apiError?.code === "CIRCULAR_DEPENDENCY") {
      return "This would create a loop: a movie cannot depend on itself, directly or through other movies.";
    }
    if (apiError?.message) {
      return apiError.message;
    }
    if (!error.response) {
      return "Cannot reach the server. Is the API running?";
    }
  }
  return "Something went wrong. Please try again.";
}