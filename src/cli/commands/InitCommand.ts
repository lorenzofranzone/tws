import chalk from 'chalk';
import * as fs from 'fs-extra';
import { setTimeout as sleep } from 'node:timers/promises';

import { cancel, confirm, intro, isCancel, outro, spinner } from '@clack/prompts';

import { APP_NAME, CONFIG_DIR, CONFIG_DIR_NAME } from '../../data/consts';
import { logError } from '../../utils/logger';
import { configCommand } from './ConfigCommand';

// Main function to initialize a new project configuration
export async function initCommand(options: { type?: string; force?: boolean }) {
  console.clear();

  // Display a cool intro banner
  intro(chalk.bgBlue.white(` ${APP_NAME.toUpperCase()} - Project initialization `));

  // Check if config folder already exists
  const exists = await fs.pathExists(CONFIG_DIR);
  if (exists) {
    // Ask the user if we should overwrite the existing folder (unless 'force' is passed)
    const overwrite = options.force
      ? true
      : await confirm({
          message: `Heads up! Looks like the "${CONFIG_DIR_NAME}" folder already exists. Want to start fresh?`,
        });

    if (isCancel(overwrite)) {
      cancel('Got it. No changes made - you’re in control.');
      return;
    }

    if (!overwrite) {
      logError('No worries. Setup was skipped - nothing changed.');
      return;
    }

    // Remove the existing config directory before proceeding
    await fs.remove(CONFIG_DIR);
  }

  // Start a spinner to indicate progress
  const s = spinner();
  s.start(`Hang tight... we're setting up the "${CONFIG_DIR_NAME}" folder 🛠️`);
  await sleep(1000); // Small delay for UX feel

  try {
    // Create the new config directory
    await fs.mkdir(CONFIG_DIR);
    s.stop(chalk.green(`Nice! The "${CONFIG_DIR_NAME}" folder is ready to roll.`));

    // Outro message to signal success
    outro(chalk.blue.bold.underline(`All done! Your project is good to go.`));
  } catch (error) {
    s.stop('Uh-oh... something went wrong while creating the folder.');
    throw error;
  }

  // Continue with additional config setup
  await configCommand(options);
}
