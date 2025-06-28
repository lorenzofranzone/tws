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
  all?: boolean;  // Aggiungi la gestione di --all
  force?: boolean;
}) {
  console.clear();
  intro(chalk.bgBlue(chalk.white(` Generating CSS from configs `)));

  // Controlla se la cartella di configurazione esiste
  const exists = await fs.pathExists(CONFIG_DIR);
  if (!exists) {
    logError(`Hmm, couldn't find the "${CONFIG_DIR}" folder. Run 'tws init' first.`);
    return;
  }

  // Trova tutti i file .config.json nella cartella di configurazione
  const configFiles = await globby('*.config.json', { cwd: CONFIG_DIR });

  if (configFiles.length === 0) {
    logError(`No configuration files found. You can create some using 'tws config'.`);
    return;
  }

  // Estrai i nomi dei moduli dai file
  const availableModules = configFiles.map((f) => f.replace('.config.json', ''));

  let selectedModules: string[] = [];

  // Se --all è passato, seleziona tutti i moduli
  if (options.all) {
    selectedModules = availableModules;  // Seleziona tutti i moduli disponibili
  } else {
    // Controlla se ci sono moduli richiesti senza configurazione
    const missingConfigs = Object.entries(options).filter(([key, value]) => value === true && !availableModules.includes(key) && key !== 'force');

    if (missingConfigs.length > 0) {
      const missingModuleNames = missingConfigs.map(([key]) => key);
      // Mostra errore dinamico per i moduli mancanti
      logError(`The following modules are not configured: ${missingModuleNames.join(', ')}. Run 'tws config --<module>' to create them.`);
      return;
    }

    // Se ci sono moduli esplicitamente selezionati, bypassa il multiselect e procedi direttamente
    if (Object.keys(options).some(key => options[key as keyof typeof options])) {
      selectedModules = Object.keys(options).filter(key => options[key as keyof typeof options] && key !== 'force'); // Escludi "force" dalla selezione dei moduli
    }
  }

  // Se nessun modulo è stato selezionato esplicitamente e --all non è abilitato, chiedi all'utente di scegliere tramite multiselect
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

  // Verifica per i moduli richiesti che non hanno file di configurazione
  const requestedModules = Object.entries(options)
    .filter(([k, v]) => availableModules.includes(k) && v === true)
    .map(([k]) => k);

  const missingRequestedConfigs = requestedModules.filter(
    (mod) => !availableModules.includes(mod)
  );

  if (missingRequestedConfigs.length > 0) {
    for (const mod of missingRequestedConfigs) {
      logError(`Configuration is missing for the "${mod}" module. Run 'tws config --${mod}' to create it.`);
    }
    return;
  }

  // Gestisci la sovrascrittura (se l'opzione force non è abilitata)
  let modulesToOverwrite: string[] = [];

  const isForceEnabled = options.force ?? false;

  if (!isForceEnabled) {
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

    // Gestisci i prompt di sovrascrittura per un singolo o più moduli
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

      // Rimuovi dalla lista quelli che non sono selezionati per la sovrascrittura
      selectedModules = selectedModules.filter((mod) => {
        const hasOutput = existingOutputModules.some((m) => m.mod === mod);
        if (hasOutput) {
          return modulesToOverwrite.includes(mod);
        }
        return true;
      });
    }
  } else {
    // Se --force è abilitato, sovrascrivi tutto
    modulesToOverwrite = selectedModules;
  }

  const s = spinner();
  s.start('Processing your styles...');

  // Cicla attraverso tutti i moduli selezionati e genera i CSS
  for (const mod of selectedModules) {
    const configPath = join(CONFIG_DIR, `${mod}.config.json`);
    const config = await fs.readJSON(configPath);
    const outDir = resolve(config.outDir);

    // Pulisce l'output esistente se necessario
    if (await fs.pathExists(outDir)) {
      if (isForceEnabled || modulesToOverwrite.includes(mod)) {
        await fs.remove(outDir);
      } else {
        s.stop(`Skipped "${mod}" since output already exists.`);
        continue;
      }
    }

    await fs.ensureDir(outDir);

    try {
      // Import dinamico del processore di configurazione del modulo
      const {
        [`${capitalize(mod)}ConfigProcessor`]: ProcessorClass,
      } = await import(
        `../../modules/${mod}/${capitalize(mod)}ConfigProcessor`
      );
      const processor = new ProcessorClass();

      // Genera i file CSS dalla configurazione
      const files = await processor.processConfig(config, isForceEnabled);

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

// Funzione di utilità per capitalizzare la prima lettera di una stringa
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
