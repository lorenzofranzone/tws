# TWS CLI — Tailwind CSS Style Generator

The **TWS CLI** is a command line tool to help you manage and generate your project styles (colors, typography, spacing, layout) through modular configuration files and generate CSS outputs easily.

<br>

## Installation

Install globally via npm:

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

   ## Colors Configuration

   | Key                  | Type                | Description                                                             | Example                     |
   |----------------------|---------------------|-------------------------------------------------------------------------|-----------------------------|
   | `outDir`             | `string`            | Directory to save the generated CSS files.                              | `"src/styles/tws/colors"`   |
   | `data.schemes.modes` | `array`             | List of theme modes. Accepts `"light"`, `"dark"`, or both.              | `["light", "dark"]`         |
   | `data.schemes.toggle`| `string`            | Method to switch themes: `"attr"`, `"class"`, or `"media"` (default).   | `"attr"`                    |
   | `data.colors.base`   | `string`            | Base property name for key colors.                                      | `"color"`                   |
   | `data.colors.map`    | `object`            | Object defining groups of theme colors with properties.                 | _See example below_         |
   | `data.default`       | `string`            | Name of the default theme in map as reference for default theme colors  | `"neutral"`                 |
   | `data.adapter`       | `string` (optional) | If `"wordpress"`, generates WordPress-compatible CSS variables.         | `"wordpress"`               |

   <br>

   ### Colors Map Example

   Each group under `data.colors.map` defines a theme utility with properties. Values can be:

   - CSS variables prefixed with `--` (resolved as `var(--color-<name>)`)
   - HEX, RGB, HSL, or named CSS colors.

   ```json
   {
   "black": ["#000"], // Fixed for light and dark
   "neutral": {
      "color": ["--neutral-50", "--indigo-950"], // First value applies to the first mode in modes (e.g., "light"), second to the second (e.g., "dark")
      "on-color": ["--neutral-950", "--neutral-100"],
      "outline": ["#ccc", "rgb(100, 100, 100)"]
   },
   }
   ```

   In this case you can use:
   ```<div class="theme-neutral bg-color text-on-color border-2 border-outline">...</div>```
   If both light and dark modes are defined, everything works automatically—no extra configuration needed.


   <br>

   ---

   <br>


   ## Typography and Spacing Configuration

   | Key        | Type            | Description                                            | Example                                   |
   |------------|-----------------|--------------------------------------------------------|-------------------------------------------|
   | `outDir`   | `string`        | Directory to save the generated CSS files.             | `"src/styles/tws/typography"`             |
   | `data.sizes` | `object`      | Defines sizes with optional responsive clamp values.   | _See example below_                       |

   <br>

   ### Sizes Example

   Each size can accept:

   - A single value (for static sizes)
   - Two values (min and max in px, converted to rem with `clamp()`)
   - Three values (min, max, [min-viewport, max-viewport] in px, converted to rem with `clamp()`)

   <br>

   #### Typography

   ```json
   {
      "h1": [24, 32], // -> will generate in @theme --text-h1 (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      "base": [16], // -> will generate in @theme --text-base (1rem)
      "custom": [24, 48, [480, 768]] // -> will generate in @theme --text-custom (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   }
   ```

   So you can use ```<h1 class="text-h1">...</h1>```
   
   #### Spacing

   ```json
   {
      "xl": [24, 32], // -> will generate in @theme --spacing-xl (uses clamp() to scale from 1.5rem (≤768px) to 2rem (≥1024px))
      "md": [16], // -> will generate in @theme --spacing-md (1rem)
      "custom": [24, 48, [480, 768]] // -> will generate in @theme --spacing-custom (uses clamp() to scale from 1.5rem (≤480px) to 3rem (≥768px))
   }
   ```

   So you can use ```<div class="p-xl">...</div>```


   <br>

   ---

   <br>


   ## Layout Configuration

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

   ### Usage

   1. **Basic layout structure**

      The layout system is based on a 12-column CSS grid. You must wrap your main sections in a <body data-layout> or a container with data-layout attribute.

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

   2. **Landmark rules**

      Landmarks like #header, #main, #footer or #intro and #outro are automatically positioned using the full-width grid.
      #aside-left, #aside-right spans the columns defined in the layout.config.json.
      Internally, each uses a subgrid to allow layout control for nested elements.

      Once inside a landmark, you can use *-area utility classes to position your content in specific parts of the grid.


      | Class Name                  | Description                                                   |
      |-----------------------------|---------------------------------------------------------------|
      | `wide-area`                 | Spans the full width of the layout.                           |
      | `wide-half-left-area`       | Left half of full width layout (from edge to center).         |
      | `wide-half-right-area`      | Right half of full width layout (from center to edge).        |
      | `container-area`            | Content constrained to the container width (c-container).     |
      | `container-wide-left-area`  | From left edge to container's right edge.                     |
      | `container-wide-right-area`	| From container's left edge to the right edge of the layout.   |
      | `main-area`                 | Uses the central part of the layout (c-main).                 |
      | `half-left-area`            | Left half of main content area.                               |
      | `half-right-area`           | Right half of main content area.                              |
      | `aside-left-area`           | Aligns content within the left aside column (c-aside-left).   |
      | `aside-right-area`          | Aligns content within the right aside column (c-aside-right). |
      | `margin-left-area`          | From edge of layout to start of container.                    |
      | `margin-right-area`         | From end of container to edge of layout.                      |

      *When using area classes, the content will align to grid columns set by the layout configuration.*

      <!--
      ***Reversed layout***
      In some cases (e.g., RTL support or alternating layouts), you may want to reverse *-left/right-areas:

      ```html
      <div class="... grid-flow-row-dense">
         <div class="...">
            <div class="half-left-area">...</div>
            <div class="half-right-area">...</div>
         </div>
         <div class="... grid-cols-reversed" data-layout>
            <div class="half-left-area">...</div>
            <div class="half-right-area">...</div>
         </div>
      ```

      This will reverse the areas of the second nested <div>:
      - half-left-area -> becomes half-right-area
      - half-right-area -> becomes half-left-area

      Use the `grid-flow-row-dense` class on the parent node to fix the correct behavior.
      -->

   3. **Nesting with Subgrid**
      You can apply subgrid-x, subgrid-y, or subgrid utility classes to allow inner elements to inherit column/row structures:

      ***Notes***
      - All layout files are auto-generated based on the layout.config.json file.
      - The CSS uses modern CSS Grid + custom properties. Browser support must include at least Grid level 2 (e.g., modern Chrome, Firefox, Safari).
      - Use media queries and CSS variables to manage breakpoints and adapt layout dynamically.

      <br>

      ---

      <br>


      ## Notes

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
