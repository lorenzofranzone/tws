import { TClampSize, TRecursiveObject } from '../modules/interfaces';
import { clamp } from './clamp';
import { logWarn } from './logger';

/**
 * ==================================================
 * toKebabCase
 * ==================================================
 * Converts a string to kebab-case.
 * Replaces spaces, underscores, and special characters
 * with hyphens while keeping only lowercase letters and numbers.
 */
export const toKebabCase = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+|_+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

/**
 * ==================================================
 * pxToRem
 * ==================================================
 * Converts a value in pixels (px) to rem based on a given base value.
 * Optionally, the result can include the 'rem' unit as a string or just
 * return the numeric value.
 * 
 * @param px - The value in pixels that needs to be converted to rem.
 * @param base - The base value to convert pixels to rem (default is 16px).
 * @param withUnit - A flag indicating whether to include the 'rem' unit in the result (default is false).
 * @returns - The equivalent value in rem, either as a string with 'rem' unit or as a number.
 */
export function pxToRem(px: number, base: number = 16, withUnit = false): string | number {
  if (px === 0) return 0;

  const remValue = px / base;
  return withUnit
    ? `${parseFloat(remValue.toFixed(4)).toString()}rem`
    : parseFloat(remValue.toFixed(4));
}

/**
 * ==================================================
 * processNestedObject
 * ==================================================
 * Recursively processes a nested object or array, applying
 * a transformation function to all its values. The keys of
 * objects are converted to kebab-case using the toKebabCase function.
 * 
 * Supports an optional maximum depth limit (`maxDepth`). If the depth
 * of a property exceeds this limit, the property will be skipped and a
 * warning will be issued (only once per unique path).
 * 
 * @param obj - The object to be processed, which can be nested.
 * @param callback - The transformation function to apply to each value.
 * @param prefix - An optional prefix to insert before the last key segment (e.g., "color").
 * @param maxDepth - Optional maximum depth. If a property path exceeds this, it will be skipped with a warning.
 * @returns The transformed object with transformed values and kebab-case keys.
 */
type TransformFn = (value: unknown) => unknown;

const warnedPaths = new Set<string>();

export function processNestedObject<T>(
  obj: T,
  callback: TransformFn,
  prefix?: string,
  maxDepth?: number
): T {
  function recurse<U>(current: U, keyPath: string[] = []): U | undefined {
    const currentDepth = keyPath.length;

    if (maxDepth !== undefined && currentDepth > maxDepth) {
      const path = keyPath.join(".");
      if (!warnedPaths.has(path)) {
        logWarn(`Skipping property at "${path}" - exceeded max depth (${maxDepth})`)
        warnedPaths.add(path);
      }
      return undefined;
    }

    if (Array.isArray(current)) {
      if (prefix && keyPath.length > 0) {
        keyPath.splice(-1, 0, prefix);
      }
      const key = keyPath.join("-");
      return { [key]: callback(current) } as U;
    } else if (typeof current === "object" && current !== null) {
      return Object.fromEntries(
        Object.entries(current).flatMap(([key, value]) => {
          const kebabKey = toKebabCase(key);
          const newKeyPath = [...keyPath, kebabKey];
          const result = recurse(value, newKeyPath);

          return result && typeof result === "object"
            ? Object.entries(result)
            : result !== undefined
              ? [[kebabKey, result]]
              : [];
        })
      ) as U;
    }

    return callback(current) as U;
  }

  return recurse(obj) as T;
}

/**
 * ==================================================
 * processObject
 * ==================================================
 * Processes an object, applying transformations to its values.
 * If the value is an array of numbers, it applies a clamp function
 * to ensure the values are within a defined range.
 * This function uses the processNestedObject to process nested structures.
 * 
 * @param data - The object to be processed.
 * @returns The processed object with clamped values where necessary.
 */
export function processObject<T>(data: T): T {
  // Process the data and apply clamping to arrays of numbers
  return processNestedObject(data, (value) => {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === 'number'
    ) {
      // Apply the clamp function to arrays of numbers
      return clamp(value as TClampSize);
    }
    return value; // Return the value unmodified if it's not an array of numbers
  });
}

/**
 * ==================================================
 * convertToCss
 * ==================================================
 * This function takes an array of objects where each object represents
 * a CSS rule or block, and recursively processes the keys and values
 * to generate a valid CSS string. It supports nested objects and generates
 * the corresponding CSS rules for each level of nesting.
 * 
 * @param arr - An array of objects.
 * @returns A string containing the generated CSS.
 */

type CSSObject = {
  [key: string]: string | CSSObject;
};

export function convertToCSS(arr: Array<{ [key: string]: CSSObject } | string>): string {
  let cssOutput = '';

  function processObject(obj: CSSObject, indentLevel: number): void {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const indent = ' '.repeat(indentLevel);

      if (typeof value === 'object') {
        cssOutput += `${indent}${key} {\n`;
        processObject(value, indentLevel + 2);
        cssOutput += `${indent}}\n`;
      } else {
        cssOutput += `${indent}${key}: ${value};\n`;
      }
    });
  }

  arr.forEach((item) => {
    if (typeof item === 'string') {
      // Se l'elemento è una stringa, aggiungila direttamente al CSS
      cssOutput += `${item}\n`;
    } else {
      Object.keys(item).forEach((key) => {
        cssOutput += `${key} {\n`;
        processObject(item[key], 2);
        cssOutput += '}\n';
      });
    }
  });

  return cssOutput;
}
