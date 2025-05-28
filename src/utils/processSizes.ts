import { IConfigBase, TClampSize, TRecursiveObject } from '../modules/interfaces';
import { clamp } from './clamp';

export function processSizes(
  input: IConfigBase<{ sizes: TRecursiveObject<TClampSize> }>,
  type: string,
  prefix: string
): { outDir: string; data: any[] } {
  const errors: Set<string> = new Set();

  validateSizesConfig(input, errors, type);

  if (errors.size > 0) {
    console.error("Validation errors:");
    errors.forEach(error => console.error(error));
    return { outDir: "", data: [] };
  }

  const { outDir, data } = input;
  const { sizes } = data;

  const theme: Record<string, string> = {};

  const processRecursive = (obj: typeof sizes, keyPath = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = keyPath ? `${keyPath}-${key}` : key;
      if (Array.isArray(value)) {
        try {
          const clamped = clamp(value);
          theme[`--${prefix}-${fullKey}`] = typeof clamped === 'number' ? `${clamped}rem` : clamped;
        } catch {
          errors.add(`${type}: Invalid clamp value at "sizes.${fullKey}".`);
        }
      } else if (typeof value === 'object' && value !== null) {
        processRecursive(value, fullKey);
      } else {
        errors.add(`${type}: Invalid value at "sizes.${fullKey}". Expected array or nested object.`);
      }
    }
  };

  processRecursive(sizes);

  if (errors.size > 0) {
    console.error("Validation errors:");
    errors.forEach(error => console.error(error));
    return { outDir: "", data: [] };
  }

  return {
    outDir,
    data: [{ '@theme': theme }],
  };
}

function validateSizesConfig(
  config: IConfigBase<{ sizes: TRecursiveObject<TClampSize> }>,
  errors: Set<string>,
  type: string
): void {
  if (!config.data) {
    errors.add(`${type}: Missing 'data' field.`);
    return;
  }

  const { sizes } = config.data;

  if (!sizes || typeof sizes !== 'object') {
    errors.add(`${type}: 'sizes' must be a valid object.`);
  }
}
