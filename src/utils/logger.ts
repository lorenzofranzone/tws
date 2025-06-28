import color from 'picocolors';

import * as p from '@clack/prompts';

const log = p.log;

export function logSuccess(message: string) {
  log.success(color.green(message));
}

export function logError(message: string) {
  log.error(color.red(message));
}

export function logWarn(message: string) {
  log.warn(color.yellow(message));
}

export function logInfo(message: string) {
  log.info(color.cyan(` ${message} `));
}

export function logStep(message: string) {
  log.message(color.gray(` ${message} `), { symbol: color.gray('⛭') });
}

export function logText(message: string) {
  log.message(color.blue(` ${message} `));
}

export function logLabel(message: string) {
  log.message(color.bgBlue(` ${message} `), { symbol: color.blue('◼︎') });
}