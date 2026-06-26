import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate base path safely
export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

// Mask name logic for frontend
export function maskName(fullName: string) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  
  const lastIndex = parts.length - 1;
  const maskedParts = parts.map((part, idx) => {
    if (idx === 0) return part;
    if (idx === lastIndex) return part;
    return part.charAt(0) + ".";
  });
  
  return maskedParts.join(" ");
}
