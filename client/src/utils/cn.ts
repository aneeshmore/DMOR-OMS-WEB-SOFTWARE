/**
 * Class Name Utility
 * Merges class names with proper handling of conditionals
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
