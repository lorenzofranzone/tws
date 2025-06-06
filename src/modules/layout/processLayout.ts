import { clamp } from '../../utils/clamp';
import { processNestedObject, pxToRem } from '../../utils/helpers';
import { ILayoutConfig, TClampSize, TColumnsCount } from '../interfaces';

export interface IProcessedLayout {
  container: string;
  breakout: string | number;
  gap: string | number;
  columnsCount: TColumnsCount;
  extraMargin?: string;
}

/**
 * ========================================
 * processLayout
 * ========================================
 * Transforms a layout configuration object into a normalized format
 * ready to be used by the theme generator.
 * It converts spacing units to rems, validates structure, and
 * gracefully handles errors with helpful feedback.
 */
export function processLayout(config: ILayoutConfig) {
  const errors: Set<string> = new Set();
  validateLayoutConfig(config, errors);

  if (errors.size > 0) {
    console.error("Hmm, looks like your layout config has a few issues:");
    errors.forEach(err => console.error("•", err));
    return { outDir: "", data: {} };
  }

  const { outDir, data } = config;
  const { container, gap, breakout, columnsCount, extraMargin } = data;

  const processedLayout = {} as IProcessedLayout;

  try {
    // Convert container width to rems
    if (container !== undefined) {
      processedLayout.container = pxToRem(container, undefined, true) as string;
    }

    // Convert breakout width to rems
    if (breakout !== undefined) {
      processedLayout.breakout = pxToRem(breakout, undefined, true);
    }

    // Clamp-based conversion for gaps
    if (gap) {
      processedLayout.gap = clamp(gap as TClampSize);
    }

    // Process nested column definitions
    if (columnsCount) {
      processedLayout.columnsCount = processNestedObject<TColumnsCount>(
        columnsCount,
        (value) => value
      );
    }

    // Optional extra margin conversion
    if (extraMargin !== undefined) {
      processedLayout.extraMargin = pxToRem(extraMargin, undefined, true) as string;
    }

  } catch (e) {
    // Friendly error message if something goes wrong during processing
    console.error("Oops! Something went wrong while processing your layout settings.");
    console.error(e);
    return { outDir: "", data: {} };
  }

  return {
    outDir,
    data: processedLayout,
  };
}

/**
 * ========================================
 * validateLayoutConfig
 * ========================================
 * Validates the structure and data types of the layout config.
 * Accumulates friendly error messages for anything invalid.
 */
function validateLayoutConfig(config: ILayoutConfig, errors: Set<string>) {
  if (!config.data || typeof config.data !== 'object') {
    errors.add("Missing or invalid 'data' field in layout config.");
    return;
  }

  const { container, gap, breakout, columnsCount, extraMargin } = config.data;

  if (container !== undefined && typeof container !== 'number') {
    errors.add("'container' should be a number (e.g. 1280).");
  }

  if (breakout !== undefined && typeof breakout !== 'number') {
    errors.add("'breakout' should be a number (e.g. 40).");
  }

  if (extraMargin !== undefined && typeof extraMargin !== 'number') {
    errors.add("'extraMargin' should be a number.");
  }

  if (gap !== undefined && !Array.isArray(gap)) {
    errors.add("'gap' must be an array using clamp format (e.g. [16, 24, 32]).");
  }

  if (columnsCount !== undefined) {
    const validKeys = ['aside-single', 'aside-left', 'aside-right'];

    for (const key of Object.keys(columnsCount)) {
      if (!validKeys.includes(key)) {
        errors.add(`Invalid key in 'columnsCount': "${key}". Valid keys are ${validKeys.join(', ')}.`);
        continue;
      }

      const value = columnsCount[key as keyof TColumnsCount];
      if (!Array.isArray(value) || value.length !== 4) {
        errors.add(`'${key}' must be an array of exactly 4 numbers.`);
        continue;
      }

      const isValid = value.every(num => typeof num === 'number');
      if (!isValid) {
        errors.add(`'${key}' must contain only numeric values.`);
      }
    }
  }
}
