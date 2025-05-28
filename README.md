# TWS CLI — Tailwind CSS Style Generator

The **TWS CLI** is a command line tool to help you manage and generate your project styles (colors, typography, spacing, layout) through modular configuration files and generate CSS outputs easily.

---
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

<br>

---

<br>


Enjoy managing your styles with **TWS CLI**!
