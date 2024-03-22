export type Variant = Record<string, string | number>;
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

/**
 * @function compareAndUpdateVariants
 */
export interface compareVariantProps {
  size: string;
  color: string;
  material: string;
  inventory: number;
  price: number;
}

interface Result {
  deletedVariants: compareVariantProps[];
  updatedVariants: compareVariantProps[];
}

export function compareAndUpdateVariants(oldData: compareVariantProps[], newData: compareVariantProps[]): Result {
  const deletedVariants: compareVariantProps[] = [];
  const updatedVariants: compareVariantProps[] = [];

  oldData.forEach((oldVariant) => {
    const index = newData.findIndex(
      (v) =>
        v.size === oldVariant.size &&
        v.color === oldVariant.color &&
        v.material === oldVariant.material
    );

    if (index !== -1) {
      // compareVariantProps exists in both old and new data, update inventory and price
      const updatedVariant: compareVariantProps = {
        ...oldVariant,
        inventory: newData[index].inventory,
        price: newData[index].price,
      };
      updatedVariants.push(updatedVariant);
      // Remove the matched variant from newData to handle duplicates
      newData.splice(index, 1);
    } else {
      // Variant exists in old data but not in new data, store in deletedVariants
      deletedVariants.push(oldVariant);
    }
  });

  // Remaining variants in newData are new and should be included in updatedVariants
  updatedVariants.push(...newData);

  return { deletedVariants, updatedVariants };
}

export type KeyGetter<T> = (obj: T) => string;

export const groupBy = <T>(array: T[], keyGetter: KeyGetter<T>): Record<string, T[]> => {
  const result: Record<string, T[]> = {};

  array.forEach((item) => {
    const key = keyGetter(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  });

  return result;
};

export const linearData = <T>(groupedData: Record<string, T[]>) => Object.values(groupedData).flat();