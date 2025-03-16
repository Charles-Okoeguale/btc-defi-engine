import { toast } from "sonner";
import axios from "axios";

export function handleError(error: unknown, context: string = "") {
  // Log for debugging
  console.error(`Error ${context}:`, error);

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || error.message;
    toast.error(message);
    return;
  }

  // Handle other errors
  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  // Fallback for unknown error types
  toast.error("An unexpected error occurred");
}