import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...styles: ClassValue[]) {
  return twMerge(clsx(styles));
}

/**
 * Separates words in a camelCase string, capitalizes first letter of each word,
 * and returns a new string.
 *
 * Example: "camelCase" => "Camel Case"
 *
 * Example: "http404Error" => "Http 404 Error"
 * @param str String to separate
 */
export function separateCamelCase(str: string) {
  let words: string[] = [];
  let start = 0;
  str.split("").forEach((char, i, arr) => {
    if (
      // char is numeric and previous char is not numeric
      (!isNaN(char as any) && isNaN(arr[i - 1] as any)) ||
      // char is not numeric and is a capital letter
      (isNaN(char as any) && char === char.toUpperCase())
    ) {
      words.push(arr.slice(start, i).join(""));
      start = i;
    } else if (i === arr.length - 1) {
      words.push(arr.slice(start).join(""));
    }
  });
  // capitalize first letter of first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}
