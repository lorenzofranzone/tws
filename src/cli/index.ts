const required = 20;
const current = parseInt(process.versions.node.split('.')[0], 10);

if (current < required) {
  console.error(
    `❌ TWS: This CLI requires Node ${required}+ but you are using ${process.version}.`
  );
  process.exit(1);
}

import { Command } from 'commander';

import { configCommand } from './commands/ConfigCommand';
import { cssCommand } from './commands/CssCommand';
import { initCommand } from './commands/InitCommand';

const program = new Command();

// CLI metadata
program
  .name('tws')
  .description('The TWS CLI – a toolkit for managing your project styles')
  .version('1.0.0');

// 'init' command: initializes the project setup
program
  .command('init')
  .description('Set up your project by creating the initial config folder')
  .option('-t, --type <type>', 'Choose config type: "base" or "example"')
  .option('-f, --force', 'Skip prompts and overwrite if needed')
  .action((options) => initCommand(options));

// 'config' command: generates configuration files for selected modules
program
  .command('config')
  .description('Generate style config files for one or more modules')
  .option('-C, --colors', 'Set up config for the "colors" module')
  .option('-T, --typography', 'Set up config for the "typography" module')
  .option('-S, --spacing', 'Set up config for the "spacing" module')
  .option('-L, --layout', 'Set up config for the "layout" module')
  .option('-a, --all', 'Configure all available modules at once')
  .option('-t, --type <type>', 'Choose config type: "base" or "example"')
  .option('-f, --force', 'Skip prompts and overwrite existing files')
  .action((options) => configCommand(options, true));

// 'css' command: turns configuration into actual CSS files
program
  .command('css')
  .description('Generate CSS output from your existing style configs')
  .option('-C, --colors', 'Generate CSS for the "colors" module')
  .option('-T, --typography', 'Generate CSS for the "typography" module')
  .option('-S, --spacing', 'Generate CSS for the "spacing" module')
  .option('-L, --layout', 'Generate CSS for the "layout" module')
  .option('-a, --all', 'Generate CSS for all available modules')
  .option('-f, --force', 'Force overwrite of existing output')
  .action((options) => cssCommand(options));

// Parse CLI arguments
program.parse();
