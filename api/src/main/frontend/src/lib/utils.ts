import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...styles: ClassValue[]) {
  return twMerge(clsx(styles));
}
