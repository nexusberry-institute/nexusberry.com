import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const courseCategories = [
    { value: "technology", label: "Technology" },
    { value: "science", label: "Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "artificial-intelligence", label: "Artificial Intelligence" },
  ] as const;