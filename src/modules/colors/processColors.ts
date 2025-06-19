import chroma from 'chroma-js';

import { IColorsConfig } from '../interfaces';

/**
 * ==================================================
 * processColors
 * ==================================================
 * Transforms a color config object into a CSS-ready structure,
 * including theme variables, custom variants, and utility classes.
 * Handles multiple color schemes, Reference compatibility, and dark mode.
 */
export function processColors(input: IColorsConfig): { outDir: string; data: any[] } {
  const errors: Set<string> = new Set();
  validateConfig(input, errors);
  if (errors.size > 0) {
    console.error('Hold on! Found some issues with your config:');
    errors.forEach(e => console.error(e));
    return { outDir: '', data: [] };
  }

  const { outDir, data } = input;
  const { schemes, colors: colorsConfig, default: defaultKey, adapter } = data;
  const { base, map } = colorsConfig;
  const modes = schemes?.modes ?? ['light'];
  const toggle = schemes?.toggle ?? 'auto';
  const defaultMode = modes[0];
  const secondMode = modes[1];
  const hasMultiple = modes.length > 1;

  const refPrefix = '--tws-color';
  const regPrefix = '--color';
  const prefix = adapter === 'reference' ? refPrefix : regPrefix;

  const toCssVar = (v: string) =>
    v.startsWith('--') ? `var(${prefix}-${v.slice(2)})` : v;

  const toRootVar = (v: string) =>
    v.startsWith('--') ? `var(${regPrefix}-${v.slice(2)})` : v;

  const theme: Record<string, string> = {};
  const firstAdapted: Record<string, string> = {};
  const secondAdapted: Record<string, string> = {};
  const entries = Object.entries(map) as [string, Record<string, string[]>][];

  // Step 0 - Reference root vars (if using REF adapter)
  if (adapter === 'reference') {
    entries.forEach(([key, props]) => {
      Object.entries(props).forEach(([prop, vals]) => {
        const v = vals[0];
        if (v && isValidColor(v)) {
          firstAdapted[`${refPrefix}-${key}-${prop}`] = toRootVar(v);
        }
      });
    });

    const defMap = map[defaultKey] as Record<string, string[]>;
    Object.keys(defMap).forEach(prop => {
      const v = defMap[prop][0];
      if (v && isValidColor(v)) {
        theme[`${regPrefix}-${prop}`] = `var(${refPrefix}-${prop})`;
        firstAdapted[`${refPrefix}-${prop}`] = toRootVar(v);
      }
    });
  }

  // Step 1 - Base semantic keys and fixed versions
  entries.forEach(([key, props]) => {
    const v = props[base]?.[0];
    if (v && !isValidColor(v)) {
      errors.add(`Invalid base for ${key}: ${v}`);
      return;
    }
    if (v) {
      theme[`${regPrefix}-${key}`] = adapter === 'reference'
        ? `var(${refPrefix}-${key}-${base})`
        : toCssVar(v);
      theme[`${regPrefix}-${key}-fixed`] = toRootVar(v);
    }
  });

  // Step 2 - Semantic defaults
  const defProps = map[defaultKey] as Record<string, string[]>;
  Object.entries(defProps).forEach(([prop, vals]) => {
    const v = vals[0];
    if (v && !isValidColor(v)) {
      errors.add(`Invalid default ${prop}: ${v}`);
      return;
    }
    if (v && !theme.hasOwnProperty(`${regPrefix}-${prop}`)) {
      theme[`${regPrefix}-${prop}`] = adapter === 'reference'
        ? `var(${refPrefix}-${prop})`
        : toCssVar(`--${defaultKey}-${prop}`);
    }
  });

  // Step 3 - All primary values for each color prop
  entries.forEach(([key, props]) => {
    Object.entries(props).forEach(([prop, vals]) => {
      const v = vals[0];
      if (v && !isValidColor(v)) {
        errors.add(`Invalid ${key}-${prop}: ${v}`);
        return;
      }
      if (v) {
        const name = `${regPrefix}-${key}-${prop}`;
        theme[name] = adapter === 'reference'
          ? `var(${refPrefix}-${key}-${prop})`
          : toCssVar(v);
      }
    });
  });

  // Step 4 - Dark mode support (if second mode is present)
  if (hasMultiple && secondMode) {
    entries.forEach(([key, props]) => {
      const v = props[base]?.[1];
      if (v && isValidColor(v)) {
        const name = adapter === 'reference'
          ? `${refPrefix}-${key}`
          : `${regPrefix}-${key}`;
        secondAdapted[name] = toRootVar(v);
      }
      Object.entries(props).forEach(([prop, vals]) => {
        const v2 = vals[1];
        if (v2 && isValidColor(v2)) {
          const name2 = adapter === 'reference'
            ? `${refPrefix}-${key}-${prop}`
            : `${regPrefix}-${key}-${prop}`;
          secondAdapted[name2] = toRootVar(v2);
        }
      });
    });

    Object.entries(defProps).forEach(([prop, vals]) => {
      const v2 = vals[1];
      if (v2 && isValidColor(v2)) {
        const name = adapter === 'reference'
          ? `${refPrefix}-${prop}`
          : `${regPrefix}-${prop}`;
        secondAdapted[name] = toRootVar(v2);
      }
    });

    secondAdapted['color-scheme'] = secondMode;
  }

  // Step 5 - Custom variant generation (class or attr toggle)
  let customVar: string | undefined;
  if (hasMultiple && secondMode) {
    if (toggle === 'class') {
      customVar = `@custom-variant ${secondMode} (&:where(.${secondMode}, .${secondMode} *));`;
    } else if (toggle === 'attr') {
      customVar = `@custom-variant ${secondMode} (&:where([data-theme=${secondMode}], [data-theme=${secondMode}] *));`;
    }
  }

  // Step 6 - Utility and dynamic classes
  const utility: Record<string, any> = {};
  const dynamic: Record<string, any> = { '@layer utilities': { '[class*="theme-"]': {} } };

  entries.forEach(([key, props]) => {
    const utilTheme: Record<string, string> = {};
    const utilFixed: Record<string, string> = {};

    Object.entries(props).forEach(([prop, vals]) => {
      utilTheme[`--color-${prop}`] = adapter === 'reference'
        ? `var(${refPrefix}-${key}-${prop})`
        : `var(${regPrefix}-${key}-${prop})`;
      const bv = vals[0];
      if (bv) utilFixed[`--color-${prop}`] = toRootVar(bv);
    });

    utility[`@utility theme-${key}`] = utilTheme;
    utility[`@utility theme-${key}-fixed`] = utilFixed;

    const accentVal = props['accent']?.[0];
    const onAccentVal = props['on-accent']?.[0];
    if (accentVal && onAccentVal) {
      dynamic['@layer utilities']['[class*="theme-"]'][`:is(.theme-${key}) .theme-accent`] = {
        '--color-color': adapter === 'reference'
          ? `var(${refPrefix}-${key}-accent)`
          : `var(${regPrefix}-${key}-accent)`,
        '--color-on-color': adapter === 'reference'
          ? `var(${refPrefix}-${key}-on-accent)`
          : `var(${regPrefix}-${key}-on-accent)`,
      };
      dynamic['@layer utilities']['[class*="theme-"]'][`:is(.theme-${key}-fixed) .theme-accent`] = {
        '--color-color': toRootVar(accentVal),
        '--color-on-color': toRootVar(onAccentVal),
      };
    }
  });

  // Step 7 - Base layer for :root and dark variant if needed
  const baseLayer: Record<string, any> = {
    '@layer base': {
      ':root': {
        ...(adapter === 'reference' ? firstAdapted : {}),
        'color-scheme': defaultMode
      }
    }
  };

  if (hasMultiple && Object.keys(secondAdapted).length) {
    const sel =
      toggle === 'class'
        ? `&.${secondMode}`
        : toggle === 'attr'
        ? `&[data-theme="${secondMode}"]`
        : '@media (prefers-color-scheme: dark)';

    baseLayer['@layer base'][':root'][sel] = secondAdapted;
  }

  return {
    outDir,
    data: [
      { '@theme': theme },
      baseLayer,
      ...(customVar ? [customVar] : []),
      utility,
      ...(Object.keys(dynamic['@layer utilities']['[class*="theme-"]']).length > 0
        ? [dynamic]
        : []),
    ],
  };
}

// Check if a string is a valid color (or CSS variable)
function isValidColor(value: string): boolean {
  if (value.startsWith('--')) return true;
  try { chroma(value); return true; } catch { return false; }
}

// Basic config shape validation
function validateConfig(config: IColorsConfig, errors: Set<string>): void {
  const { data } = config;
  if (!data) { errors.add("colors: Missing data"); return; }
  if (!data.schemes) errors.add("colors: Missing schemes");
  if (!data.colors) errors.add("colors: Missing colors");
}
