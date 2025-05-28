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

**Example:**

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

Generate colors config only:

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


<br>

---

<br>


## Help

For help on any command:

```shell
tws <command> --help
```
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
   "neutral": {
      "color": ["--neutral-50", "--indigo-950"],
      "on-color": ["--neutral-950", "--neutral-100"],
      "outline": ["#ccc", "rgb(100, 100, 100)"]
   },
   "primary": {
      "color": ["--violet-950", "--violet-900"],
      "on-color": ["--white", "--neutral-50"],
      "gradient-stop-1": ["--violet-950", "--purple-800"]
   }
   }
   ```


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

   ```json
   {
   "display": [32, 90],
   "h1": [24, 32],
   "sm": [14],
   "responsive": [12, 18, [768, 1024]]
   }
   ```


   <br>

   ---

   <br>


   ## Layout Configuration

   | Key                 | Type       | Description                                                                           | Example                    |
   |---------------------|------------|---------------------------------------------------------------------------------------|----------------------------|
   | `outDir`            | `string`   | Directory to save the generated CSS files.                                            | `"src/styles/tws/layout"`  |
   | `data.container`    | `number`   | Width of the container in px.                                                         | `1110`                     |
   | `data.columnGap`    | `array`    | Defines column gaps with clamp logic.                                                 | `[10, 30]`                 |
   | `data.rowGap`       | `array`    | Defines row gaps with clamp logic.                                                    | `[0]`                      |
   | `data.breakout`     | `number`   | Extra lateral spacing beyond container width.                                         | `40`                       |
   | `data.columnsCount` | `object`   | Defines columns per layout breakpoint: `[mobile, tablet, tablet-landscape, desktop]`. | `[0, 0, 0, 3]`             |
   | `data.extraMargin`  | `number`   | Additional margin to add on the sides.                                                | `8`                        |


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

Enjoy managing your styles with **TWS CLI**!
