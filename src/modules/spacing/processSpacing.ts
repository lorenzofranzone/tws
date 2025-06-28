import { clamp } from '../../utils/clamp';
import { ISpacingConfig } from '../interfaces';

/**
 * ========================================
 * processSpacing
 * ========================================
 * Transforms a spacing config into CSS custom properties
 * using `clamp()` values. Handles nested structures recursively.
 * Gracefully reports invalid values with helpful messages.
 */
export function processSpacing(input: ISpacingConfig): { outDir: string; data: any[] } {
  const errors: Set<string> = new Set();

  validateSpacingConfig(input, errors);

  if (errors.size > 0) {
    console.error("Hmm, looks like your spacing config has some issues:");
    errors.forEach(error => console.error("•", error));
    return { outDir: "", data: [] };
  }

  const { outDir, data } = input;
  const { sizes } = data;

  const theme: Record<string, string> = {};

  /**
   * Recursively processes nested spacing definitions and builds
   * CSS custom properties prefixed with `--text-`.
   */
  const processRecursive = (obj: typeof sizes, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = `${prefix}${key}`;

      if (Array.isArray(value)) {
        try {
          const clamped = clamp(value);
          theme[`--text-${fullKey}`] =
            typeof clamped === 'number' ? `${clamped}rem` : clamped;
        } catch {
          errors.add(`spacing: Invalid clamp value at "sizes.${fullKey}".`);
        }

      } else if (typeof value === 'object' && value !== null) {
        // Recurse into nested groups (e.g. sizes.large.mobile)
        processRecursive(value, `${fullKey}-`);
      } else {
        errors.add(`spacing: Invalid value at "sizes.${fullKey}". Expected array or nested object.`);
      }
    }
  };

  processRecursive(sizes);

  // Return early if any errors were collected during processing
  if (errors.size > 0) {
    console.error("Some values couldn't be processed due to errors:");
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
 * ========================================
 * validateSpacingConfig
 * ========================================
 * Performs basic structural validation of the spacing config.
 */
function validateSpacingConfig(config: ISpacingConfig, errors: Set<string>): void {
  if (!config.data) {
    errors.add("spacing: Missing 'data' field.");
    return;
  }

  const { sizes } = config.data;

  if (!sizes || typeof sizes !== 'object') {
    errors.add("spacing: 'sizes' must be a valid object.");
  }
}
