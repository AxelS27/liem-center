import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

// The monorepo keeps a single root `.env` (see turbo.json globalDependencies and
// apps/server/src/lib/load-env.ts). Next.js only auto-loads `.env*` from the app
// directory, so walk up from cwd and load the nearest `.env` into process.env
// before the app boots. NEXT_PUBLIC_* vars are then inlined as usual.
function loadRootEnv(startDirectory = process.cwd()) {
  let currentDirectory = startDirectory;

  while (parse(currentDirectory).root !== currentDirectory) {
    const candidate = join(currentDirectory, '.env');

    if (existsSync(candidate)) {
      for (const line of readFileSync(candidate, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        const separatorIndex = trimmed.indexOf('=');

        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();

        process.env[key] ??= value;
      }

      return;
    }

    currentDirectory = dirname(currentDirectory);
  }
}

loadRootEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Internal packages are consumed as TypeScript source (see docs/engineering/ARCHITECTURE.md),
  // so Next must transpile them.
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],
};

export default nextConfig;
