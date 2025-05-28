import chalk from 'chalk';
import * as fs from 'fs-extra';
import { globby } from 'globby';
import { join, resolve } from 'path';

import { cancel, confirm, intro, isCancel, multiselect, outro, spinner } from '@clack/prompts';

import { CONFIG_DIR } from '../../data/consts';
import { cssHeaderFile } from '../../utils/css';
import { logError } from '../../utils/logger';

// Main command to generate CSS files from JSON configurations
export async function cssCommand(options: {
  colors?: boolean;
  typography?: boolean;
  spacing?: boolean;
  layout?: boolean;
  all?: boolean;
  force?: boolean;
}) {
  console.clear();
  intro(chalk.bgBlue.white(` Generating CSS from configs `));

  // Check if config folder exists
  const exists = await fs.pathExists(CONFIG_DIR);
  if (!exists) {
    logError(`Hmm, couldn't find the "${CONFIG_DIR}" folder. Run 'tws init' first.`);
    return;
  }

  // Find all .config.json files in the config folder
  const configFiles = await globby('*.config.json', { cwd: CONFIG_DIR });

  if (configFiles.length === 0) {
    logError(`No configuration files found. You can create some using 'tws config'.`);
    return;
  }

  // Extract module names from file names
  const availableModules = configFiles.map((f) => f.replace('.config.json', ''));

  let selectedModules: string[] = [];

  // Select all modules if --all is passed
  if (options.all) {
    selectedModules = availableModules;
  } else {
    // Otherwise pick only those explicitly flagged
    for (const mod of availableModules) {
      if (options[mod as keyof typeof options]) selectedModules.push(mod);
    }
  }

  // Check for CLI-requested modules that don't have config files
  const requestedModules = Object.entries(options)
    .filter(([k, v]) => availableModules.includes(k) && v === true)
    .map(([k]) => k);

  const missingConfigs = requestedModules.filter(
    (mod) => !availableModules.includes(mod)
  );

  if (missingConfigs.length > 0) {
    for (const mod of missingConfigs) {
      logError(
        `Missing configuration for "${mod}". Try running 'tws config --${mod}' to create it.`
      );
    }
    return;
  }

  // If no modules selected yet, prompt user
  if (selectedModules.length === 0) {
    const result = await multiselect({
      message: 'Choose which modules you want to generate CSS for:',
      options: availableModules.map((mod) => ({ value: mod, label: mod })),
    });

    if (isCancel(result)) {
      cancel('No worries. CSS generation was cancelled.');
      return;
    }

    selectedModules = result as string[];
  }

  // Handle potential overwrites (if force not enabled)
  let modulesToOverwrite: string[] = [];

  if (!options.force) {
    const existingOutputModules: { mod: string; outDir: string }[] = [];

    for (const mod of selectedModules) {
      const configPath = join(CONFIG_DIR, `${mod}.config.json`);
      if (!(await fs.pathExists(configPath))) {
        logError(`Missing config file for "${mod}". Skipping this one.`);
        continue;
      }

      const config = await fs.readJSON(configPath);
      const outDir = resolve(config.outDir);
      if (await fs.pathExists(outDir)) {
        existingOutputModules.push({ mod, outDir });
      }
    }

    // Handle single or multiple overwrite prompts
    if (existingOutputModules.length === 1) {
      const { mod, outDir } = existingOutputModules[0];
      const confirmOverwrite = await confirm({
        message: `The output folder "${outDir}" for "${mod}" already exists. Should we replace it?`,
      });

      if (isCancel(confirmOverwrite) || !confirmOverwrite) {
        cancel(`Skipping "${mod}" as requested.`);
        selectedModules = selectedModules.filter((m) => m !== mod);
      } else {
        modulesToOverwrite.push(mod);
      }
    } else if (existingOutputModules.length > 1) {
      const overwriteResult = await multiselect({
        message: 'Some output folders already exist. Select the ones you want to replace:',
        options: existingOutputModules.map(({ mod }) => ({
          value: mod,
          label: mod,
        })),
      });

      if (isCancel(overwriteResult)) {
        cancel('CSS generation cancelled.');
        return;
      }

      modulesToOverwrite = overwriteResult as string[];

      // Remove from processing those not selected for overwrite
      selectedModules = selectedModules.filter((mod) => {
        const hasOutput = existingOutputModules.some((m) => m.mod === mod);
        if (hasOutput) {
          return modulesToOverwrite.includes(mod);
        }
        return true;
      });
    }
  } else {
    // If --force, overwrite everything
    modulesToOverwrite = selectedModules;
  }

  const s = spinner();
  s.start('Processing your styles...');

  // Loop through all selected modules and generate CSS
  for (const mod of selectedModules) {
    const configPath = join(CONFIG_DIR, `${mod}.config.json`);
    const config = await fs.readJSON(configPath);
    const outDir = resolve(config.outDir);

    // Clean existing output if needed
    if (await fs.pathExists(outDir)) {
      if (options.force || modulesToOverwrite.includes(mod)) {
        await fs.remove(outDir);
      } else {
        s.stop(`Skipped "${mod}" since output already exists.`);
        continue;
      }
    }

    await fs.ensureDir(outDir);

    try {
      // Dynamically import the module's config processor
      const {
        [`${capitalize(mod)}ConfigProcessor`]: ProcessorClass,
      } = await import(
        `../../modules/${mod}/${capitalize(mod)}ConfigProcessor`
      );
      const processor = new ProcessorClass();

      // Generate the CSS files from config
      const files = await processor.processConfig(config, options.force ?? false);

      for (const file of files) {
        const contentWithHeader = cssHeaderFile + file.content;
        await fs.outputFile(file.path, contentWithHeader);
      }

      s.stop(chalk.green(`CSS for "${mod}" has been successfully generated.`));
    } catch (err) {
      s.stop(`Something went wrong while processing "${mod}".`);
      console.error(err);
    }
  }

  outro(chalk.blue.bold.underline(`CSS generation complete. You're good to go.`));
}

// Utility function to capitalize the first letter of a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
