import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

function findEnvFile(startDirectory: string) {
  let currentDirectory = startDirectory;

  while (parse(currentDirectory).root !== currentDirectory) {
    const candidate = join(currentDirectory, '.env');

    if (existsSync(candidate)) {
      return candidate;
    }

    currentDirectory = dirname(currentDirectory);
  }

  return undefined;
}

export function loadEnvFile(startDirectory = process.cwd()) {
  const envFile = findEnvFile(startDirectory);

  if (!envFile) {
    return;
  }

  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    process.env[key] ??= value;
  }
}
