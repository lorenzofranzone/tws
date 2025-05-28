import path from 'path';

export const APP_NAME = "tws"
export const APP_DESCRIPTION = "Tailwindcss Styles Generator"
export const CONFIG_DIR_NAME = "tws-config";
export const CONFIG_DIR = path.resolve(process.cwd(), `${CONFIG_DIR_NAME}`);
export const APP_FONT = "ANSI Regular"

export const STYLES = {
    colors: { base: 'config-base.json', example: 'config-example.json' },
    typography: { base: 'config-base.json', example: 'config-example.json' },
    spacing: { base: 'config-base.json', example: 'config-example.json' },
    layout: { base: 'config-base.json', example: 'config-example.json' }
} as const;
    
export const AVAILABLE_STYLES = Object.keys(STYLES);
export const VALID_CONFIG_TYPES = ['base', 'example'];
  