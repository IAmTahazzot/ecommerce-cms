import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Variant = Record<string, string>;
/***
 * Generate all possible combinations of variants
 * 
 * @param options - Record of variant names and their values
 * @returns Array of all possible combinations of variants
 * 
 * @example
 * const variants = generateVariants({
 *  color: ['red', 'green'],
 *  size: ['sm', 'md', 'lg']
 * })
 * 
 * console.log (variants)
 * 
 * // Output
 * [
 * { color: 'red', size: 'sm' },
 * { color: 'red', size: 'md' },
 * { color: 'red', size: 'lg' },
 * { color: 'green', size: 'sm' },
 * { color: 'green', size: 'md' },
 * { color: 'green', size: 'lg' }
 * ]
 */
export function generateVariants(options: Record<string, string[]>): Variant[] {
  const keys = Object.keys(options);
  const result: Variant[] = [];

  function generate(index: number, currentVariant: Variant) {
    if (index === keys.length) {
      result.push({ ...currentVariant });
      return;
    }

    const currentKey = keys[index];
    const values = options[currentKey];

    for (const value of values) {
      currentVariant[currentKey] = value;
      generate(index + 1, currentVariant);
    }
  }
    generate(0, {});

  return result;
}