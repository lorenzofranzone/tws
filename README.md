# TWS — Tailwind 4 Styles Generator

**TWS** is a command line tool to help you manage and generate modular Tailwind 4 styles with smart themes, responsive scales, and grid-powered layouts through modular configuration files and generate CSS outputs easily.

Instantly generate semantic colors for any theme with built-in support for light and dark modes, responsive typography and spacing, and a flexible layout system based on a 12-column grid — all designed to streamline your design system and speed up your Tailwind workflow.

<br>

## Installation

Install via npm:
```shell
npm install tws
```

or if you want it available globally
```shell
npm install -g tws
```

<br>

## Usage

```shell
tws <command> [options]
```

<br>

## Commands & Options
<details>
   <summary>Read more</summary>
   
   ### 1. `init`

   Initialize your project style setup by creating the configuration folder.

   **Options:**

   - `-t, --type <type>` — Choose config type for the styles to setup:  
   - `"base"` (minimal setup)  
   - `"example"` (with example configs)

   - `-f, --force` — Skip prompts and overwrite existing config folder

   <br>

   **Examples:**

   | Command                       | Explanation                                                              |
   |-------------------------------|--------------------------------------------------------------------------|
   | `tws init`                    | Create the `tws-config` folder interactively                             |
   | `tws init --type example`     | Create the config folder with example config files                       |
   | `tws init --force`            | Create or overwrite the config folder without confirmation               |
   | `tws init --type base --force`| Create the config folder with base setup, overwrite without confirmation |

   <br>

   ---

   <br>

   ### 2. `config`

   Generate or update configuration files for one or more style modules.

   **Options:**

   - `-C, --colors` — Generate config for **colors**
   - `-T, --typography` — Generate config for **typography**
   - `-S, --spacing` — Generate config for **spacing**
   - `-L, --layout` — Generate config for **layout**
   - `-a, --all` — Generate config for **all modules at once**
   - `-t, --type <type>` — Choose config type (`base` or `example`)
   - `-f, --force` — Overwrite existing config files without prompt

   <br>

   **Examples:**

   | Command                                        | Explanation                                                   |
   |-----------------------------------------------|----------------------------------------------------------------|
   | `tws config`                                  | Run config command with interactive prompts                    |
   | `tws config --colors`                         | Generate config for colors module only                         |
   | `tws config --colors --typography`            | Generate config for colors and typography modules              |
   | `tws config --colors --type example`          | Generate colors config with example setup                      |
   | `tws config --colors --type base --force`     | Generate base colors config, overwrite existing without prompt |
   | `tws config --all --type base --force`        | Generate base config for all modules, overwrite existing       |


   <br>

   ---

   <br>


   ### 3. `css`

   Generate CSS files from your existing style configs.

   **Options:**

   - `-C, --colors` — Generate CSS for **colors**
   - `-T, --typography` — Generate CSS for **typography**
   - `-S, --spacing` — Generate CSS for **spacing**
   - `-L, --layout` — Generate CSS for **layout**
   - `-a, --all` — Generate CSS for **all modules**
   - `-f, --force` — Force overwrite existing CSS output

   <br>

   **Examples:**

   | Command                             | Explanation                                                        |
   |-------------------------------------|--------------------------------------------------------------------|
   | `tws css`                           | Generate CSS files interactively (prompt for modules)              |
   | `tws css --colors`                  | Generate CSS files for the colors module                           |
   | `tws css --colors --typography`     | Generate CSS files for both colors and typography modules          |
   | `tws css --colors --force`          | Generate CSS files for colors, overwrite without confirmation      |
   | `tws css --all --force`             | Generate CSS files for all modules, overwrite without confirmation |


   <br>

   ---

   <br>


   ## Typical Workflow

   1. **Initialize your project** (creates config folder)

      ```shell
      tws init
      ```

      If you want to add some config after initialization use:

      ```shell
      tws config
      ```

   2. **Edit the config files** inside the generated `tws-config/` folder to customize your styles.

   3. **Generate CSS files** based on your configs

      ```shell
      tws css --all
      ```

   4. **Include the generated CSS files** in your project’s build or HTML.


   <br>

   ---

   <br>


   ## Notes

   - Running `tws init` will create a `tws-config/` folder if it doesn’t exist.
   - If the `tws-config/` folder already exists, the CLI will ask if you want to overwrite it unless you use the `--force` flag.
   - You can generate or update configs module-by-module or all at once.
   - The CLI ensures you don’t overwrite existing CSS outputs without confirmation unless you use `--force`.
   - Config files are saved as JSON in the `tws-config/` folder.
   - Generated CSS files are saved in the output directories specified inside each config file.
   </details>

   <br>

## Config files
<details>
   <summary>Read more</summary>

   Your project configuration is split into modular files:

   - colors.config.json
   - typography.config.json
   - spacing.config.json
   - layout.config.json

   Each file defines a JSON-like structure that will be processed into CSS output. Below is a guide for each module's configuration.

   <br>

   ### Colors Configuration

   | Key                  | Type                | Description                                                             | Example                     |
   |----------------------|---------------------|-------------------------------------------------------------------------|-----------------------------|
   | `outDir`             | `string`            | Directory to save the generated CSS files.                              | `"src/styles/tws/colors"`   |
   | `data.schemes.modes` | `array`             | List of theme modes. Accepts `"light"`, `"dark"`, or both.              | `["light", "dark"]`         |
   | `data.schemes.toggle`| `string`            | Method to switch themes: `"attr"`, `"class"`, or `"media"` (default).   | `"attr"`                    |
   | `data.colors.base`   | `string`            | Base property name for key colors.                                      | `"color"`                   |
   | `data.colors.map`    | `object`            | Object defining groups of theme colors with properties.                 | _See example below_         |
   | `data.default`       | `string`            | Name of the default theme in map as reference for default theme colors  | `"neutral"`                 |
   | `data.adapter`       | `string` (optional) | If `"reference"`, generates all CSS variables by reference.             | `"reference"`               |

   <br>

   #### :: Colors Map Example

   The data.colors.map object defines one or more named themes. Each theme can define multiple semantic properties (color, on-color, outline, etc.). Each property accepts:

   - A single value (used for all modes)
   - An array of values (one for each mode in modes)
   - CSS variables (e.g., "--neutral-50") or raw color values ("#ccc", "rgb(...)", "hsl(...)")

   ```json
   {
      "dark": ["#121212"], // Fixed for light and dark
      "neutral": {
         "color": ["--neutral-50", "--indigo-950"], // First value applies to the first mode in modes (e.g., "light"), second to the second (e.g., "dark")
         "on-color": ["--neutral-950", "--neutral-100"],
         "outline": ["#ccc", "rgb(100, 100, 100)"]
      },
      "primary": {
         "color": ["--primary-500", "--primary-400"],
         "on-color": ["--neutral-950"],
      },
      ...
   }
   ```

   In this example:
   - neutral and primary define semantic themes.
   - Each theme generates an additional `*-fixed` variant to keep the same color in light and dark mode if needed.
   - Each theme can automatically switch between light/dark values based on the selected mode.
   - You can change the theme just by applying a class:

   ```html
   <div class="theme-neutral bg-color text-on-color">...</div>
   <div class="theme-primary bg-color text-on-color">...</div>
   <div class="theme-primary-fixed bg-color text-on-color">...</div>
   ```
   Switching between themes updates all related colors automatically.
   Switching modes (e.g. via data-theme="dark" if using toggle: "attr") adapts them for dark mode:
   ```html
   <html data-theme="dark">
      ...
   </html>
   ```

   No need to manually rewrite CSS — everything is scoped and generated for you.

   Without a `theme-*` class, will use the properties of the default theme defined in `data.default`.

   <br>

   <details>
      <summary>Visual example</summary>
      <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/colors/themes.gif" />
   </details>

   <br>

   ---

   <br>


   ### Typography and Spacing Configuration

   | Key        | Type            | Description                                            | Example                                   |
   |------------|-----------------|--------------------------------------------------------|-------------------------------------------|
   | `outDir`   | `string`        | Directory to save the generated CSS files.             | `"src/styles/tws/typography"`             |
   | `data.sizes` | `object`      | Defines sizes with optional responsive clamp values.   | _See example below_                       |

   <br>

   #### :: Sizes Example

   Each size can accept:

   - A single value (for static sizes)
   - Two numeric values representing the min and max in pixels (px). These will be automatically converted to rem using clamp() under the hood.
   - Three values — min, max, and [min-viewport, max-viewport] in px. These will be converted following the same logic as above.

   <br>

   ##### Typography `data.sizes`

   ```json
   {
      "h1": [24, 32], // -> will generate in @theme --text-h1 (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      "base": [16], // -> will generate in @theme --text-base (1rem)
      "custom": [24, 48, [480, 768]] // -> will generate in @theme --text-custom (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   }
   ```

   So you can use ```<h1 class="text-h1">...</h1>``` instead of ```<h1 class="text-[24px] md:text-[28px] lg:text-[32px]">...</h1>``` or writing media queries in external css files.


   <br>
   
   ---
   
   <br>
   
   ##### Spacing `data.sizes`

   ```json
   {
      "xl": [24, 32], // -> will generate in @theme --spacing-xl (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      "md": [16], // -> will generate in @theme --spacing-md (1rem)
      "custom": [24, 48, [480, 768]] // -> will generate in @theme --spacing-custom (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   }
   ```

   So you can use ```<div class="p-xl">...</div>``` instead of ```<div class="p-[24px] md:p-[28px] lg:p-[32px]">...</div>``` or writing media queries in external css files.


   <br>

   ---

   <br>


   ### Layout Configuration

   | Key                              | Type       | Description                                                                                    | Example                    |
   |----------------------------------|------------|------------------------------------------------------------------------------------------------|----------------------------|
   | `outDir`                         | `string`   | Directory to save the generated CSS files.                                                     | `"src/styles/tws/layout"`  |
   | `data.container`                 | `number`   | Width of the container in px.                                                                  | `1110`                     |
   | `data.gap`                       | `array`    | Defines the global gaps with clamp logic.                                                      | `[10, 30]`                 |
   | `data.breakout`                  | `number`   | Defines a width value usable for custom layout scenarios.                                      | `40`                       |
   | `data.columnsCount.aside-single` | `object`   | Defines columns per layout breakpoint: `[mobile, tablet-portrait, tablet-landscape, desktop]`. | `[0, 0, 0, 4]`             |
   | `data.columnsCount.aside-left`   | `object`   | Defines columns per layout breakpoint: `[mobile, tablet-portrait, tablet-landscape, desktop]`. | `[0, 0, 0, 3]`             |
   | `data.columnsCount.aside-right`  | `object`   | Defines columns per layout breakpoint: `[mobile, tablet-portrait, tablet-landscape, desktop]`. | `[0, 0, 0, 3]`             |
   | `data.extraMargin`               | `number`   | Additional margin to add on the sides (default margin spaces by gap).                          | `8`                        |

   #### Usage

   1. **Basic layout structure**

      The layout system is based on a 12-column CSS grid. You must wrap your main sections in a <body data-layout> or a container with `data-layout` attribute.

      ```html
      <body data-layout>
         <!--Header Landmark-->
         <header id="header">...</header>
         <!--Optional intro section-->
         <div id="intro">...</div>
         <!--Optional Aside Left Landmark-->
         <aside id="aside-left">...</aside>
         <!--Header Landmark-->
         <main id="main">...</main>
         <!--Optional Aside Right Landmark-->
         <aside id="aside-right">...</aside>
         <!--Header Landmark-->
         <div id="outro">...</div>
         <!--Footer Landmark-->
         <div id="footer">...</div>
      </body>
      ```
      
      - You can omit any of these sections. The layout adapts based on presence of #aside-left and #aside-right.
      - This structure ensures consistent column management and responsive behavior.

      If you want to remove spacing between columns:

      ```html
      <body data-layout="no-gap">
         ...
      </body>
      ```
      <br>
      
      **:: Examples of layouts** <br>
      *The background color defines the landmark* <br>
      *the dotted border defines the inner default area where direct children are placed*
      
      <br>
      <details>
         <summary>Base Layout</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/landmarks/layout-landmarks-1-responsive.gif" />
      </details>
      <br>
      <details>
         <summary>Layout with sidebar on the left</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/landmarks/layout-landmarks-2-responsive.gif" />
      </details>
      <br>
      <details>
         <summary>Layout with sidebar on the right</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/landmarks/layout-landmarks-3-responsive.gif" />
      </details>
      <br>
      <details>
         <summary>Layout with sidebar on the left and right</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/landmarks/layout-landmarks-4-responsive.gif" />
      </details>
      <br>
      <details>
         <summary>Layout with all landmarks + intro and outro</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/landmarks/layout-landmarks-5-responsive.gif" />
      </details>
      <br>

   2. **Landmark rules**

      Landmarks like #header, #main, #footer or #intro and #outro are automatically positioned using the full-width grid.
      #aside-left, #aside-right spans the columns defined in the layout.config.json.
      Internally, each uses a subgrid to allow layout control for nested elements.

      Once inside a landmark, you can use *-area utility classes to position your content in specific parts of the grid.


      | Class Name                       | Description                                                                |
      |----------------------------------|----------------------------------------------------------------------------|
      | `wide-area`                      | Spans the full width of the layout.                                        |
      | `wide-half-left-area`            | Spans the left half of the full layout (from edge to center).              |
      | `wide-half-right-area`           | Spans the right half of the full layout (from center to edge).             |
      | `container-area`                 | Content constrained to the container width                                 |
      | `container-wide-left-area`       | Spans from the left edge of the layout to the right edge of the container. |
      | `container-wide-right-area`      | Spans from the left edge of the container to the right edge of the layout. |
      | `container-half-left-area`       | Left half of the container width.                                          |
      | `container-half-right-area`      | Right half of the container width.                                         |
      | `container-third-left-area`      | Left third of the container width.                                         |
      | `container-two-third-left-area`  | Left two-thirds of the container width.                                    |
      | `container-third-right-area`     | Right third of the container width.                                        |
      | `container-two-third-right-area` | Right two-thirds of the container width.                                   |
      | `main-area`                      | Central content area, excluding side columns.                              |
      | `half-left-area`                 | Left half of the main content area.                                        |
      | `half-right-area`                | Right half of the main content area.                                       |
      | `aside-left-area`                | Content aligned within the left aside column.                              |
      | `aside-right-area`               | Content aligned within the right aside column.                             |
      | `margin-left-area`               | From the layout's left edge to the start of the container.                 |
      | `margin-right-area`              | From the end of the container to the layout’s right edge.                  |
      
      <br>

      **:: Examples of areas** <br>
      *The background color defines the landmark* <br>
      *the dotted border defined the inner default area where direct children are placed*
      
      <br>
      <details>
         <summary>Available areas on full width spaces</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/areas/layout-areas-1.png" />
      </details>
      <br>
      <details>
         <summary>Available areas when a sidebar on the left is used</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/areas/layout-areas-2.png" />
      </details>
      <br>
      <details>
         <summary>Available areas when a sidebar on the right is used</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/areas/layout-areas-3.png" />
      </details>
      <br>
      <details>
         <summary>Available areas when two sidebars are used</summary>
         <img src="https://raw.githubusercontent.com/lorenzofranzone/tws/main/dist/docs/images/layout/areas/layout-areas-4.png" />
      </details>
      <br>


   3. **Nesting with Subgrid**
      You can apply subgrid-x, subgrid-y, or subgrid utility classes to allow inner elements to inherit column/row structures:

      ***Notes***
      - All layout files are auto-generated based on the layout.config.json file.
      - The CSS uses modern CSS Grid + custom properties. Browser support must include at least Grid level 2 (e.g., modern Chrome, Firefox, Safari).
      - Use media queries and CSS variables to manage breakpoints and adapt layout dynamically.

      <br>

      ---

      <br>


      ### Notes

      - All CSS variables must be prefixed with `--*` to be resolved as `var(--<scope>-*)`.
      - Color values support CSS valid colors, or CSS variables.
      - Clamp logic applies automatically to typography, spacing, and layout values when providing min-max arrays.
</details>

<br>

---

<br>


## Help

For help on any command:

```shell
tws <command> --help
```

<br>

---

<br>

Enjoy managing your styles with **TWS CLI**!
