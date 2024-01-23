import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const hubColorMap = {
  boston: "bg-gray-900",
  chicago: "bg-blue-500",
  "new-york-city": "bg-orange-600",
};
export function getHubColor(hub: "chicago" | "boston" | "new-york-city") {
  return hubColorMap[hub] || "bg-black";
}
