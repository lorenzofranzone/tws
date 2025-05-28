
# Configuration

This CLI tool supports modular configuration files for colors, typography, spacing, and layout. Below is a detailed explanation of the structure and available options for each configuration module.

---

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

### Colors Map Example

Each group under `data.colors.map` defines a theme utility with properties. Values can be:

- CSS variables prefixed with `--` (resolved as `var(--name)`)
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

---

## Typography and Spacing Configuration

| Key        | Type            | Description                                            | Example                                   |
|------------|-----------------|--------------------------------------------------------|-------------------------------------------|
| `outDir`   | `string`        | Directory to save the generated CSS files.             | `"src/styles/tws/typography"`             |
| `data.sizes` | `object`      | Defines sizes with optional responsive clamp values.   | _See example below_                       |

### Sizes Example

Each size can accept:

- A single value (for static sizes)
- Two values (min and max in px, converted to rem with `clamp()`)
- Three values (min, max, [min-viewport, max-viewport] in px, converted to rem with `clamp()`)

```json
{
  "display": [32, 90],
  "h1": [24, 32],
  "sm": [14],
  "responsive": [12, 18, [768, 1024]]
}
```

---

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

---

## Notes

- All CSS variables must be prefixed with `--*` to be resolved as `var(--<scope>-*)`.
- Color values support CSS valid colors, or CSS variables.
- Clamp logic applies automatically to typography, spacing, and layout values when providing min-max arrays.
