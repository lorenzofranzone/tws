# TWS - CSS Styles generator for Tailwind 4

Instantly generate semantic colors for any theme with built-in support for light and dark modes, responsive typography and spacing, and a flexible layout system based on a 12-column grid — all designed to streamline your design system and speed up your Tailwind workflow.

▶️ [Watch a simple demo on YouTube](https://www.youtube.com/watch?v=hNZibQPr0Kw)

---

<br>

**Table of contents**
- <a href="#installation">Installation</a>
- <a href="#usage">Usage</a>
- <a href="#commands">Commands and options</a>
- <a href="#configs">Config files</a>
- <a href="#help">Help</a>

## Installation

Install via npm:

```shell
npm install tws
```

or if you want it available globally

```shell
npm install -g tws
```

## Usage

<details>
   
   <summary>How to use TWS</summary>
   
   <br>
   
   Run the `tws` commands from the root of your project

   ```shell
   tws <command> [options]
   ```
</details>

## Commands and options

<details>

   <summary>How to use commands and options</summary>

   ### 1. `init` command

   Initialize *TWS* by creating the configuration folder where to store the config files for each style.

   **Options:**

   - `-t`, `--type <type>` — Choose the config type for the styles:  
      - `"base"` (minimal setup)  
      - `"example"` (with example configs)

   - `-f`, `--force` — Skip prompts and overwrite existing config folder

   **Example**

   | Command                       | Explanation                                                             |
   |-------------------------------|-------------------------------------------------------------------------|
   | `tws init`                    | Create the `tws-config` folder with interactive prompts                 |
   | `tws init --type example`     | Create the config folder with example config files                      |
   | `tws init --force`            | Create or overwrite the config folder without confirmation              |
   | `tws init --type base --force`| Create the config folder with base setup, overwrite without confirmation|

   ### 2. `config` command

   Generate or update configuration files for one or more style modules.

   **Options:**

   - `-C`, `--colors` — Generate config for **colors**
   - `-T`, `--typography` — Generate config for **typography**
   - `-S`, `--spacing` — Generate config for **spacing**
   - `-L`, `--layout` — Generate config for **layout**
   - `-a`, `--all` — Generate config for **all modules at once**
   - `-t`, `--type <type>` — Choose config type (`base` or `example`)
   - `-f`, `--force` — Force overwrite existing config files without confirmation

   <br>

   **Examples:**

   | Command                                  | Explanation                                                   |
   |------------------------------------------|---------------------------------------------------------------|
   | `tws config`                             | Run config command with interactive prompts                   |
   | `tws config --colors`                    | Generate config for colors module only                        |
   | `tws config --colors --typography`       | Generate config for colors and typography modules             |
   | `tws config --colors --type example`     | Generate colors config with example setup                     |
   | `tws config --colors --type base --force`| Generate base colors config, overwrite existing without prompt|
   | `tws config --all --type base --force`   | Generate base config for all modules, overwrite existing      |

   ### 3. `css` command

   Generate CSS files from your existing style configs.

   **Options:**

   - `-C`, `--colors` — Generate CSS for **colors**
   - `-T`, `--typography` — Generate CSS for **typography**
   - `-S`, `--spacing` — Generate CSS for **spacing**
   - `-L`, `--layout` — Generate CSS for **layout**
   - `-a`, `--all` — Generate CSS for **all modules**
   - `-f`, `--force` — Force overwrite existing CSS output without confirmation

   <br>

   **Examples:**

   | Command                        | Explanation                                                       |
   |--------------------------------|-------------------------------------------------------------------|
   | `tws css`                      | Generate CSS files with interactive prompts                       |
   | `tws css --colors`             | Generate CSS files for the colors module only                     |
   | `tws css --colors --typography`| Generate CSS files for both colors and typography modules         |
   | `tws css --colors --force`     | Generate CSS files for colors, overwrite without confirmation     |
   | `tws css --all --force`        | Generate CSS files for all modules, overwrite without confirmation|

   <br>

   #### Typical workflow

   - Install the cli: `npm install tws`
   - Initialize the project and select the modules you need:`tws init`
   - Generate the CSS files when your configs are ready: `tws css`

   <br>

   ### Notes

   - Running `tws init` will create a `tws-config/` folder if it doesn’t exist.
   - If the `tws-config/` folder already exists, the CLI will ask if you want to overwrite it unless you use the `--force` flag.
   - You can generate or update configs module-by-module or all at once.
   - The CLI ensures you don’t overwrite existing CSS outputs without confirmation unless you use `--force`.
   - Config files are saved as JSON in the `tws-config/` folder.
   - Generated CSS files are saved in the output directories specified inside each config file.

</details>

## Config files

   Your project configuration is split into modular files inside the `tws-config` folder in the root of your project:

   - colors.config.json
   - typography.config.json
   - spacing.config.json
   - layout.config.json

   Each file defines a JSON-like structure that will be processed into CSS output. Below is a guide for each module's configuration.

   **Explore the config files**

<details>

   <summary>Colors</summary>

   | Key                  | Type               | Description                                                                       | Example                  |
   |----------------------|--------------------|-----------------------------------------------------------------------------------|--------------------------|
   | `outDir`             | `string`           | Directory where the generated CSS files will be saved.                            | `"src/styles/tws/colors"`|
   | `data.schemes.modes` | `array`            | List of theme modes. Accepts `"light"`, `"dark"`, or.  both.                      | `["light", "dark"]`      |
   | `data.schemes.toggle`| `string`           | Method to switch themes: `"attr"`, `"class"`, or `"media"` (default).             | `"attr"`                 |
   | `data.colors.base`   | `string`           | Base property name for the key colors of your project.                            | `"color"`                |
   | `data.colors.map`    | `object`           | Object defining groups of theme colors with semantic properties.                  | _See example below_      |
   | `data.default`       | `string`           | Name of the colors map property as reference for the default theme color utilities| `"neutral"`              |
   | `data.adapter`       | `string` (optional)| If `"reference"`, generates all CSS variables by reference for each mode.         | `"reference"`            |

   The data.colors.map object defines one or more named themes. Each theme can define multiple semantic properties (color, on-color, outline, etc.). Each property accepts:

   - A single value (used for all modes)
   - An array of values (one for each mode in modes)
   - CSS variables (e.g., "--neutral-50") or raw color values ("red", "#ccc", "rgb(...)", "hsl(...)", etc.)
   
   <br>

   **Example**

   ```json
   {
      "outDir": "src/styles/tws/colors",
      "data": {
         "schemes": {
               "modes": ["light", "dark"],
               "toggle": "attr"
         },
         "colors": {
               "base": "color",
               "map": {
                  "neutral": {
                     "color": ["--light", "--dark"],
                     "on-color": ["--neutral-900", "--neutral-100"]
                  },
                  "primary": {
                     "color": ["--violet-800", "--violet-400"],
                     "on-color": ["--violet-100", "--violet-900"]
                  }
               }
         },
         "default": "neutral"
      }
   }
   ```

   - `outDir` :: Running `tws css -C` generates the CSS at `src/styles/tws/colors/colors.css`
   - `data.schemes.modes` :: prepare the color themes for light and dark modes
   - data.schemes.toggle :: using `"attr"` you can toggle the theme via `<html data-theme="light">...</html>` or `<html data-theme="dark">...</html>`
   - `data.colors.base` :: defines which property to use for each theme to define its key color:
      - The "neutral" color is `var(--color-light)` in light mode and `var(--color-dark)` in dark mode
      - The "primary" color is `var(--color-violet-800)` in light mode and `var(--color-violet-400)` in dark mode
      - So when you use classes like `bg-neutral` or `bg-primary` you know which color will be used
      - Are also automatically generated and available "fixed" utilities for themes and semantic colors like "neutral-fixed" or "primary-fixed" (e.g., `theme-primary-fixed` or `bg-primary-fixed`)
   - `data.colors.map` :: defines the themes and its semantic colors for each mode:
      - We are setting two themes: "Neutral" and "Primary"
      - classes like `theme-neutral bg-color` or `theme-primary bg-color` will change the background getting right colors based on the theme
   - `data.default` :: defines which theme is used by default if no "theme-*" class is applied. The semantic color variables defined in this default theme will serve as the base values. Other themes can override these base variables only if they define semantic colors with the same names.
   - `data.adapter` [optional] :: changes how CSS custom properties are generated. Instead of outputting values directly for light and dark modes, it generates CSS variables by reference. This means:
      - a main custom property (e.g., --color-primary) is defined by referencing a theme-specific variable (e.g., var(--tws-color-primary))
      - both light and dark themes override the reference target, not the main variable itself
      - This approach is especially useful in systems like WordPress (Gutenberg), where block editor colors need to automatically adapt to light or dark modes.

</details>

<details>

   <summary>Typography and Spacing</summary>

   | Key         | Type    | Description                                           | Example                      |
   |-------------|---------|-------------------------------------------------------|------------------------------|
   | `outDir`    | `string`| Directory where the generated CSS files will be saved.| `"src/styles/tws/typography"`|
   | `data.sizes`| `object`| Defines sizes with optional responsive clamp values.. | _See example below_          |

   Each size can accept:

   - A single value (for static sizes)
   - Two numeric values representing the min and max in pixels (px). These will be automatically converted to rem using clamp() under the hood.
   - Three values — min, max, and [min-viewport, max-viewport] in px. These will be converted following the same logic as above.

   <br>

   **Typography example**

   ```json
   {
      "outDir": "src/styles/tws/typography",
      "data": {
         "sizes": {
            "h1": [24, 32],
            "base": [16],
            "custom": [24, 48, [480, 768]]
         }
      }
   }
   ```

   - `outDir` :: Running `tws css -C` generates the CSS at `src/styles/tws/typography/typography.css`
   - `data.sizes` :: The "sizes" property lists all the fixed/responsive sizes:
      - "h1" will generate in `@theme` a css custom property `--text-h1` (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      - "base" will generate in `@theme` `--text-base` (1rem fixed)
      - "custom" will generate in `@theme` a css custom property `--text-custom` (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   
   So you can use `<h1 class="text-h1">...</h1>` instead of `<h1 class="text-[24px] md:text-[28px] lg:text-[32px]">...</h1>` or writing media queries in external css files.
   
   <br>

   **Spacing example**

   ```json
   {
      "outDir": "src/styles/tws/spacing",
      "data": {
         "sizes": {
            "xl": [24, 32],
            "md": [16],
            "foo": [24, 48, [480, 768]]
         }
      }
   }
   ```

   - `outDir` :: Running `tws css -C` generates the CSS at `src/styles/tws/spacing/spacing.css`
   - `data.sizes` :: The "sizes" property lists all the fixed/responsive sizes:
      - "xl" will generate in `@theme` a css custom property `--spacing-xl` (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      - "base" will generate in `@theme` `--spacing-md` (1rem fixed)
      - "foo" will generate in `@theme` a css custom property `--spacing-foo` (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   
   So you can use `<div class="p-xl">...</div>` instead of `<div class="p-[24px] md:p-[28px] lg:p-[32px]">...</div>` or writing media queries in external css files.

</details>

<details>

   <summary>Layout</summary>

   | Key                             | Type    | Description                                                                                         | Example                  |
   |---------------------------------|---------|-----------------------------------------------------------------------------------------------------|--------------------------|
   | `outDir`                        | `string`| Directory where the generated CSS files will be saved.                                              | `"src/styles/tws/layout"`|
   | `data.container`                | `number`| Width of the container in px.                       .                                               | `1110`                   |
   | `data.gap`                      | `array` | Defines the global columns gap with clamp logic (the same used for typography and spacing).         | `[10, 30]`               |
   | `data.breakout`                 | `number`| Defines a width value in px usable for arbitrary custom layout scenarios.                           | `40`                     |
   | `data.columnsCount.aside-single`| `object`| Defines columns per layout breakpoint: [`mobile`, `tablet-portrait`, `tablet-landscape`, `desktop`].| `[0, 0, 0, 4]`           |
   | `data.columnsCount.aside-left`  | `object`| Defines columns per layout breakpoint: [`mobile`, `tablet-portrait`, `tablet-landscape`, `desktop`].| `[0, 0, 0, 3]`           |
   | `data.columnsCount.aside-right` | `object`| Defines columns per layout breakpoint: [`mobile`, `tablet-portrait`, `tablet-landscape`, `desktop`].| `[0, 0, 0, 3]`           |
   | `data.extraMargin`              | `number`| Additional margin in px to add on the sides (default margin spaces by gap).                         | `8`                      |

   <br>
   
   1. **Layout structure**

      The layout system is based on a 12-column CSS grid. You must wrap your markup in a <body data-layout> or a tag with `data-layout` attribute.

      <br>

      ```html
      <body data-layout>
         <!--Header Landmark-->
         <header id="header">...</header>
         <!--Intro Section-->
         <div id="intro">...</div>
         <!--Optional Aside Left Landmark-->
         <aside id="aside-left">...</aside>
         <!--Main Landmark-->
         <main id="main">...</main>
         <!--Aside Right Landmark-->
         <aside id="aside-right">...</aside>
         <!--Outro Section-->
         <div id="outro">...</div>
         <!--Footer Landmark-->
         <div id="footer">...</div>
      </body>
      ```
      
      - It's important to use this tags with its own id attributes.
      - You can omit any of these sections. The layout adapts based on the presence of #aside-left and #aside-right.
      - This structure ensures consistent column management and responsive behavior.

      If you want to remove spacing between columns:

      ```html
      <body data-layout="no-gap">
         ...
      </body>
      ```

      <br>

   2. **Layout areas ready to use**

      | Class Name                      | Description                                                               |
      |---------------------------------|---------------------------------------------------------------------------|
      | `wide-area`                     | Spans the full width of the layout.                                       |
      | `wide-half-left-area`           | Spans the left half of the full layout (from edge to center).             |
      | `wide-half-right-area`          | Spans the right half of the full layout (from center to edge).            |
      | `container-area`                | Content constrained to the container width                                |
      | `container-wide-left-area`      | Spans from the left edge of the layout to the right edge of the container.|
      | `container-wide-right-area`     | Spans from the left edge of the container to the right edge of the layout.|
      | `container-half-left-area`      | Left half of the container width.                                         |
      | `container-half-right-area`     | Right half of the container width.                                        |
      | `container-third-left-area`     | Left third of the container width.                                        |
      | `container-two-third-left-area` | Left two-thirds of the container width.                                   |
      | `container-third-right-area`    | Right third of the container width.                                       |
      | `container-two-third-right-area`| Right two-thirds of the container width.                                  |
      | `main-area`                     | Central content area, excluding side columns.                             |
      | `half-left-area`                | Left half of the main content area.                                       |
      | `half-right-area`               | Right half of the main content area.                                      |
      | `aside-left-area`               | Content aligned within the left aside column.                             |
      | `aside-right-area`              | Content aligned within the right aside column.                            |
      | `margin-left-area`              | From the layout's left edge to the start of the container.                |
      | `margin-right-area`             | From the end of the container to the layout’s right edge.                 |

      <br>
      
      ```html
      <body data-layout>
         <!--Header Landmark-->
         <header id="header">...</header>
         <!--Main Landmark-->
         <main id="main">
            <div class="col-span-full tx:half-left-area">...</div>
            <div class="col-span-full tx:half-right-area">...</div>
         </main>
         <!--Footer Landmark-->
         <div id="footer">...</div>
      </body>
      ```

      - This example uses a layout with `header`, `main` and `footer`
      - The main content has two `div` in column 100% (mobile) and one side the other 50%/50% (from tablet landscape)
      
      <br>

   3. **Nesting with subgrid**

      You can apply subgrid-x, subgrid-y, or subgrid utility classes to allow inner elements to inherit column/row structures:

      ***Notes***
      - All layout files are auto-generated based on the layout.config.json file.
      - The CSS uses modern CSS Grid + custom properties. Browser support must include at least Grid level 2 (e.g., modern Chrome, Firefox, Safari).
      - Use media queries and CSS variables to manage breakpoints and adapt layout dynamically.

</details>

## Help

For help on any command:

```shell
tws <command> --help
```

<br>

---

Enjoy managing your styles with **TWS CLI**!