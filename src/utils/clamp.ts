import { TClampSize } from '../modules/interfaces';
import { pxToRem } from './helpers';

/**
 * ==================================================
 * clamp
 * ==================================================
 * This function generates a CSS clamp function based on the provided
 * values for minimum, maximum, and viewport width. It converts the
 * provided pixel values to rem and adjusts based on viewport width
 * to create a responsive range.
 *
 * @param value - An array where:
 *                - value[0] is the minimum size in pixels,
 *                - value[1] is the maximum size in pixels (optional),
 *                - value[2] is an optional array with viewport min and max (default: 768-1024).
 * @returns A string representing the CSS `clamp()` function.
 */
export function clamp(value: TClampSize): string | number {
  // If there is only one value, return it directly in rem
  if (value.length === 1) {
    return pxToRem(value[0], undefined, true);
  }

  // Extract min and max values, with checks for undefined
  const min = value[0];
  const max = value[1] ?? min; // Set `max` to `min` if `max` is undefined

  // Extract viewport min and max (default: 768-1024 if undefined)
  const vMin = value[2]?.[0] ?? 768;
  const vMax = value[2]?.[1] ?? 1024;

  // Convert min and max to rem units
  const minRem = pxToRem(min) as number;
  const maxRem = pxToRem(max) as number;

  // Calculate the slope for the clamp function and the y-axis intercept
  const slope = (maxRem - minRem) / (vMax - vMin);
  const yAxis = -vMin * slope + minRem;

  // Calculate the adjustment factor for the vw unit
  const val = slope * 16 * 100;

  // Return the CSS `clamp()` function with the calculated values
  return `clamp(${minRem}rem, ${yAxis}rem + ${val}vw, ${maxRem}rem)`;
}
