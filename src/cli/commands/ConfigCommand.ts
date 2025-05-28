import chalk from 'chalk';
import * as fs from 'fs-extra';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'path';

import {
    cancel, confirm, intro, isCancel, multiselect, outro, select, spinner
} from '@clack/prompts';

import { APP_NAME, AVAILABLE_STYLES, CONFIG_DIR } from '../../data/consts';
import { logError } from '../../utils/logger';

type TConfigCommandOptions = {
  colors?: boolean;
  typography?: boolean;
  spacing?: boolean;
  layout?: boolean;
  all?: boolean;
  type?: string;
  force?: boolean;
};

// Wrapper for prompts that gracefully handle user cancellations
async function safePrompt<T>(
  promptFn: () => Promise<T | symbol>,
  cancelMessage: string
): Promise<T | null> {
  const result = await promptFn();
  if (isCancel(result)) {
    cancel(cancelMessage);
    return null;
  }
  return result as T;
}

export async function configCommand(
  options: TConfigCommandOptions,
  clearConsole: boolean = false
) {
  if (clearConsole) {
    console.clear();
  }

  // Intro banner
  intro(chalk.bgBlue.white(` ${APP_NAME.toUpperCase()} - Style configuration files `));

  // Make sure the configuration directory exists
  if (!(await fs.pathExists(CONFIG_DIR))) {
    logError(`Looks like the "${CONFIG_DIR}" folder is missing. Run 'tws init' first.`);
    return;
  }

  let selectedModules: string[] = [];

  // Automatically select all modules if --all flag is used
  if (options.all) {
    selectedModules = AVAILABLE_STYLES;
  } else {
    // Otherwise, check which specific modules were selected via flags
    for (const mod of AVAILABLE_STYLES) {
      if (options[mod as keyof typeof options]) selectedModules.push(mod);
    }
  }

  // If no modules selected yet, ask the user to choose via multiselect
  if (selectedModules.length === 0) {
    const result = await safePrompt(
      () =>
        multiselect({
          message: 'Which modules would you like to configure?',
          options: AVAILABLE_STYLES.map((mod) => ({
            value: mod,
            label: mod,
          })),
        }),
      'No styles selected. Configuration was cancelled.'
    );

    if (!result) return;
    selectedModules = result;
  }

  let type = options.type;

  // If no type provided, ask the user which type of configuration to use
  if (!type) {
    const result = await safePrompt(
      () =>
        select({
          message: 'Choose a configuration type:',
          options: [
            { value: 'base', label: 'Base' },
            { value: 'example', label: 'Example' },
          ],
        }),
      'No type selected. Configuration was cancelled.'
    );

    if (!result) return;
    type = result;
  }

  // Prepare the file creation plan
  const filesToCreate = selectedModules.map((mod) => {
    const configFileName = `${mod}.config.json`;
    const targetFile = path.join(CONFIG_DIR, configFileName);
    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'modules',
      mod,
      'config',
      `config-${type}.json`
    );

    return { mod, configFileName, targetFile, templatePath };
  });

  // Check for already existing config files
  const alreadyExisting = await Promise.all(
    filesToCreate.map(async (file) => ({
      ...file,
      exists: await fs.pathExists(file.targetFile),
    }))
  ).then((result) => result.filter((file) => file.exists));

  let overwriteSelection: string[] = [];

  // Handle user confirmation for overwriting existing files
  if (alreadyExisting.length > 0 && !options.force) {
    if (alreadyExisting.length === 1) {
      const file = alreadyExisting[0];
      const confirmOverwrite = await safePrompt(
        () =>
          confirm({
            message: `The file "${file.configFileName}" already exists. Do you want to replace it?`,
          }),
        'No problem. We didn’t overwrite anything.'
      );

      if (confirmOverwrite === null) return;
      if (confirmOverwrite) {
        overwriteSelection = [file.mod];
      }
    } else {
      const result = await safePrompt(
        () =>
          multiselect({
            message: 'Some configuration files already exist. Select which ones to overwrite:',
            options: alreadyExisting.map(({ mod, configFileName }) => ({
              value: mod,
              label: configFileName,
            })),
          }),
        'Overwrite selection cancelled. No files were changed.'
      );

      if (!result) return;
      overwriteSelection = result;
    }
  }


  // Start spinner to indicate progress
  const s = spinner();
  s.start(`Creating your configuration files...`);

  for (const { mod, configFileName, targetFile, templatePath } of filesToCreate) {
    const alreadyExists = await fs.pathExists(targetFile);

    // Skip file creation unless force is enabled or user selected to overwrite
    if (alreadyExists && !options.force && !overwriteSelection.includes(mod)) {
      continue;
    }

    await sleep(500); // Optional delay to smooth UX

    try {
      if (!(await fs.pathExists(templatePath))) {
        s.stop(chalk.green(`Skipped: template not found for "${mod}"`));
        continue;
      }

      await fs.copy(templatePath, targetFile);
      s.stop(chalk.green(`"${configFileName}" has been created.`));
    } catch (err) {
      s.stop(chalk.red(`Failed to create "${configFileName}".`));
      console.error(err);
    }
  }

  // Final message after everything is done
  outro(chalk.blue.bold.underline(`Style configuration complete. You're all set.`));
}
