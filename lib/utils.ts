import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for verbose logging on Vercel
export function debugLog(message: string, data?: any) {
  console.log(`🔍 DEBUG: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}
