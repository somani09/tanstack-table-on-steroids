import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const shadowDepthPrimary =
  "shadow-[0_2px_6px_rgba(1,42,74,0.15),_0_6px_12px_rgba(1,42,74,0.2),_0_12px_24px_rgba(1,42,74,0.25),_0_20px_32px_rgba(1,42,74,0.2),_0_32px_48px_rgba(1,42,74,0.15)]";
