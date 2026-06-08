import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const coreDocs = [
  'docs/product/PRD.md',
  'docs/product/FEATURES.md',
  'docs/engineering/PROGRESS.md',
  'docs/engineering/ARCHITECTURE.md',
  'docs/engineering/DECISIONS.md',
  'docs/engineering/API.md',
  'docs/engineering/FRONTEND.md',
  'docs/product/UI_UX.md',
  'docs/engineering/BACKEND.md',
  'docs/engineering/DATABASE.md',
  'docs/engineering/PAYMENTS.md',
  'docs/product/REFERENCES.md',
  'docs/engineering/QUALITY.md',
];

const rootDocs = ['AGENTS.md', 'README.md', 'CLAUDE.md'];
const guideDocs = [
  'docs/guides/HOW_TO_USE_THIS_TEMPLATE.md',
  'docs/guides/INIT.md',
  'docs/guides/CONTINUE.md',
];
const supabaseFiles = [
  'supabase/migrations/.gitkeep',
  'supabase/seed.sql',
  'packages/types/src/database.types.ts',
];
const goldenPathFiles = [
  'packages/types/src/health.ts',
  'apps/server/src/app.ts',
  'apps/server/src/app.test.ts',
  'apps/web/src/services/health.ts',
  'apps/web/src/app/page.tsx',
  'packages/utils/src/index.test.ts',
];
const requiredFiles = [
  ...rootDocs,
  ...guideDocs,
  ...coreDocs,
  ...supabaseFiles,
  ...goldenPathFiles,
];
const failures = [];
const warnings = [];

function filePath(relativePath) {
  return join(root, relativePath);
}

function read(relativePath) {
  return readFileSync(filePath(relativePath), 'utf8');
}

function existsAndNotEmpty(relativePath) {
  try {
    const stat = statSync(filePath(relativePath));
    if (!stat.isFile()) {
      failures.push(`${relativePath} exists but is not a file.`);
      return;
    }
    if (stat.size === 0 && !relativePath.endsWith('.gitkeep')) {
      failures.push(`${relativePath} is empty.`);
    }
  } catch {
    failures.push(`${relativePath} is missing.`);
  }
}

for (const file of requiredFiles) {
  existsAndNotEmpty(file);
}

let packageJson;
try {
  packageJson = JSON.parse(read('package.json'));
} catch (error) {
  failures.push(`package.json could not be parsed: ${error.message}`);
}

if (packageJson) {
  for (const scriptName of [
    'docs:check',
    'verify',
    'db:diff',
    'db:new',
    'db:push',
    'db:reset',
    'db:types',
  ]) {
    if (!packageJson.scripts?.[scriptName]) {
      failures.push(`package.json is missing the "${scriptName}" script.`);
    }
  }
}

let howToUse = '';
try {
  howToUse = read('docs/guides/HOW_TO_USE_THIS_TEMPLATE.md');
} catch {
  // Missing file is already reported above.
}

for (const doc of coreDocs) {
  if (howToUse && !howToUse.includes(doc)) {
    failures.push(`docs/guides/HOW_TO_USE_THIS_TEMPLATE.md does not mention ${doc}.`);
  }
}

let progress = '';
try {
  progress = read('docs/engineering/PROGRESS.md');
} catch {
  // Missing file is already reported above.
}

for (const doc of [
  'docs/product/PRD.md',
  'docs/product/FEATURES.md',
  'docs/product/UI_UX.md',
  'docs/engineering/API.md',
  'docs/engineering/FRONTEND.md',
  'docs/engineering/BACKEND.md',
  'docs/engineering/DATABASE.md',
  'docs/engineering/PAYMENTS.md',
  'docs/engineering/QUALITY.md',
]) {
  if (progress && !progress.includes(doc)) {
    warnings.push(
      `docs/engineering/PROGRESS.md does not mention ${doc}; confirm this is intentional.`,
    );
  }
}

const placeholderChecks = [
  'docs/product/PRD.md',
  'docs/product/FEATURES.md',
  'docs/product/UI_UX.md',
  'docs/engineering/DATABASE.md',
  'docs/engineering/PROGRESS.md',
];

for (const doc of placeholderChecks) {
  try {
    const content = read(doc);
    const placeholderCount = (content.match(/<[^>\n]+>/g) ?? []).length;
    if (placeholderCount > 0) {
      warnings.push(`${doc} still contains ${placeholderCount} template placeholder(s).`);
    }
  } catch {
    // Missing file is already reported above.
  }
}

for (const doc of requiredFiles) {
  try {
    const content = read(doc);
    if (/[�Â]|â[^\s]/.test(content)) {
      warnings.push(`${doc} may contain mojibake/encoding artifacts.`);
    }
  } catch {
    // Missing file is already reported above.
  }
}

let databaseDoc = '';
try {
  databaseDoc = read('docs/engineering/DATABASE.md');
} catch {
  // Missing file is already reported above.
}

for (const requiredPhrase of [
  'supabase/migrations/',
  'supabase/seed.sql',
  'packages/types/src/database.types.ts',
  'pnpm db:diff',
  'pnpm db:push',
]) {
  if (databaseDoc && !databaseDoc.includes(requiredPhrase)) {
    failures.push(`docs/engineering/DATABASE.md does not mention ${requiredPhrase}.`);
  }
}

let apiDoc = '';
let healthContract = '';
let serverApp = '';
let webHealthService = '';
let ciWorkflow = '';

try {
  apiDoc = read('docs/engineering/API.md');
  healthContract = read('packages/types/src/health.ts');
  serverApp = read('apps/server/src/app.ts');
  webHealthService = read('apps/web/src/services/health.ts');
  ciWorkflow = read('.github/workflows/ci.yml');
} catch {
  // Missing files are already reported above.
}

for (const [label, content] of [
  ['docs/engineering/API.md', apiDoc],
  ['packages/types/src/health.ts', healthContract],
  ['apps/server/src/app.ts', serverApp],
  ['apps/web/src/services/health.ts', webHealthService],
]) {
  if (content && !content.includes('healthResponseSchema')) {
    failures.push(`${label} should reference healthResponseSchema for the golden path.`);
  }
}

for (const command of ['pnpm docs:check', 'pnpm format:check', 'pnpm verify']) {
  if (ciWorkflow && !ciWorkflow.includes(command)) {
    failures.push(`.github/workflows/ci.yml does not run ${command}.`);
  }
}

let paymentsDoc = '';
try {
  paymentsDoc = read('docs/engineering/PAYMENTS.md');
} catch {
  // Missing file is already reported above.
}

for (const phrase of ['merchant of record', 'seller payout', 'webhook retries', 'refund']) {
  if (paymentsDoc && !paymentsDoc.toLowerCase().includes(phrase)) {
    warnings.push(
      `docs/engineering/PAYMENTS.md may be missing payment readiness coverage for "${phrase}".`,
    );
  }
}

if (failures.length > 0) {
  console.error('Docs check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
}

if (warnings.length > 0) {
  console.warn('Docs check warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length === 0) {
  console.log('Docs check passed.');
}

process.exit(failures.length > 0 ? 1 : 0);
