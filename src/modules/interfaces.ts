/* -------------------------------------------------- */  
/* Config */
/* -------------------------------------------------- */

export interface IConfigBase<TData> {
    outDir: string;
    data: TData;
  }
  
/* -------------------------------------------------- */  
/* Colors */
/* -------------------------------------------------- */

export type TColorScheme = 'light' | 'dark';
export type TColorSchemeToggle = 'class' | 'attr' | 'auto';
export type TColorsMap = Record<string, string[] | Record<string, string[]>>;

export interface IColorsConfig
  extends IConfigBase<{
    schemes?: {
      modes: [TColorScheme, TColorScheme?];
      toggle?: TColorSchemeToggle;
    };
    colors: {
      base: string;
      map: TColorsMap;
    };
    default: string;
    adapter?: 'reference'
  }> {}
  
/* -------------------------------------------------- */  
/* Typography */
/* -------------------------------------------------- */

export interface ITypographyConfig
  extends IConfigBase<{
    sizes: TRecursiveObject<TClampSize>;
  }> {}
  
/* -------------------------------------------------- */  
/* Spacing */
/* -------------------------------------------------- */

export interface ISpacingConfig
  extends IConfigBase<{
    sizes: TRecursiveObject<TClampSize>;
  }> {}
  
/* -------------------------------------------------- */  
/* Layout */
/* -------------------------------------------------- */

export type TColumnsCount = {
  'aside-single': [
    TSingleColumnsCount,
    TSingleColumnsCount,
    TSingleColumnsCount,
    TSingleColumnsCount
  ],
  'aside-left': [
    TDoubleColumnsCount,
    TDoubleColumnsCount,
    TDoubleColumnsCount,
    TDoubleColumnsCount
  ],
  'aside-right': [
    TDoubleColumnsCount,
    TDoubleColumnsCount,
    TDoubleColumnsCount,
    TDoubleColumnsCount
  ]
}
export type TSingleColumnsCount = 0 | 2 | 4;
export type TDoubleColumnsCount = 0 | 2 | 3 | 4;

export interface ILayoutConfig
  extends IConfigBase<{
    container?: number;
    gap?: TClampSize;
    breakout?: number;
    columnsCount?: TColumnsCount;
    extraMargin?: number;
  }> {}
  
/* -------------------------------------------------- */  
/* Common */
/* -------------------------------------------------- */

export type TRecursiveObject<T> = {
  [key: string]: T | TRecursiveObject<T>;
};

export type TClampSize = [number, number?, [number, number]?];
  