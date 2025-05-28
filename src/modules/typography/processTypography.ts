import { clamp } from '../../utils/clamp';
import { ITypographyConfig } from '../interfaces';

/**
 * ==================================================
 * processTypography
 * ==================================================
 * Converts typography configuration into CSS variables
 * using clamp() values.
 * Supports nested structures and reports validation errors.
 */
export function processTypography(input: ITypographyConfig): { outDir: string; data: any[] } {
  const errors: Set<string> = new Set();

  validateTypographyConfig(input, errors);

  if (errors.size > 0) {
    console.error("There are errors in the typography configuration:");
    errors.forEach(error => console.error("•", error));
    return { outDir: "", data: [] };
  }

  const { outDir, data } = input;
  const { sizes } = data;

  const theme: Record<string, string> = {};

  /**
   * Recursive function to process values (clamp arrays or nested objects)
   */
  const processRecursive = (obj: typeof sizes, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = `${prefix}${key}`;

      if (Array.isArray(value)) {
        try {
          const clamped = clamp(value);
          theme[`--text-${fullKey}`] = typeof clamped === 'number' ? `${clamped}rem` : clamped;
        } catch {
          errors.add(`typography: Invalid clamp value at "fontSizes.${fullKey}".`);
        }

      } else if (typeof value === 'object' && value !== null) {
        processRecursive(value, `${fullKey}-`);
      } else {
        errors.add(`typography: Invalid value at "fontSizes.${fullKey}". Expected array or nested object.`);
      }
    }
  };

  processRecursive(sizes);

  if (errors.size > 0) {
    console.error("Errors occurred during processing:");
    errors.forEach(error => console.error("•", error));
    return { outDir: "", data: [] };
  }

  return {
    outDir,
    data: [
      { '@theme': theme }
    ],
  };
}

/**
 * ==================================================
 * validateTypographyConfig
 * ==================================================
 * Checks the configuration for minimum valid structure.
 */
function validateTypographyConfig(config: ITypographyConfig, errors: Set<string>): void {
  if (!config.data) {
    errors.add("typography: Missing 'data' field.");
    return;
  }

  const { sizes } = config.data;

  if (!sizes || typeof sizes !== 'object') {
    errors.add("typography: 'fontSizes' must be a valid object.");
  }
}
