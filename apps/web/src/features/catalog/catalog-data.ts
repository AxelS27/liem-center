import type { StaticImageData } from 'next/image';

import preview1 from '@/assets/preview-1.png';
import preview2 from '@/assets/preview-2.png';
import preview3 from '@/assets/preview-3.png';

// Mock catalog data for the frontend build. This is a data module on purpose: components render
// it, they never define product data inline (see AGENTS.md Iron Law 2). When the backend lands,
// this is replaced by typed fetches from apps/server against the contracts in packages/types.

// Delivery mechanism: how the buyer receives the product. Drives purchase + library behaviour.
export type ProductType = 'free' | 'github' | 'download' | 'bundle';

// Product category: what kind of product it is. Drives the catalog filter.
export type ProductCategory = 'repos' | 'apps' | 'prompts' | 'skills' | 'templates' | 'bundle';

export type ChangelogEntry = {
  version: string;
  date: string;
  changes: string[];
};

export type RoadmapStatus = 'planned' | 'in_progress' | 'completed';

export type RoadmapItem = {
  title: string;
  status: RoadmapStatus;
  detail?: string;
};

export type Review = {
  author: string;
  tier: string;
  rating: number;
  title: string;
  body: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  type: ProductType;
  category: ProductCategory;
  priceIdr: number;
  version: string;
  updatedAt: string;
  cover: StaticImageData;
  overview: string[];
  features: string[];
  requires?: string[];
  githubRepo?: string;
  changelog: ChangelogEntry[];
  roadmap: RoadmapItem[];
  reviews: Review[];
};

export const productTypeLabels: Record<ProductType, string> = {
  free: 'Free',
  github: 'GitHub',
  download: 'Download',
  bundle: 'Bundle',
};

export const categoryLabels: Record<ProductCategory, string> = {
  repos: 'GitHub',
  apps: 'Apps',
  prompts: 'Prompts',
  skills: 'Skills',
  templates: 'Templates',
  bundle: 'Bundle',
};

export function formatPrice(priceIdr: number): string {
  if (priceIdr === 0) {
    return 'Free';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(priceIdr);
}

const products: Product[] = [
  {
    slug: 'liem-monorepo',
    name: 'Liem Monorepo',
    tagline: 'A production-grade TypeScript monorepo foundation for serious product builds.',
    type: 'github',
    category: 'repos',
    priceIdr: 799000,
    version: 'v2.1.0',
    updatedAt: '2026-05-28',
    cover: preview1,
    githubRepo: 'liem/monorepo',
    overview: [
      'Liem Monorepo is the opinionated starting point behind every Liem product: pnpm workspaces, Turborepo, strict TypeScript, and enforced import boundaries out of the box.',
      'Buying it creates a permanent entitlement on your account. Connect GitHub once and you receive an automatic repository invitation, so access feels native to your workflow.',
    ],
    features: [
      'pnpm + Turborepo workspace wired for web, server, and shared packages',
      'Strict TypeScript base config and flat ESLint with import-boundary rules',
      'Hono API skeleton with Zod-validated contracts in packages/types',
      'Supabase auth, database, and storage pre-wired',
    ],
    changelog: [
      {
        version: 'v2.1.0',
        date: '2026-05-28',
        changes: [
          'Added GitHub App based repository invites',
          'Improved Docker compose for local Supabase',
          'Documentation pass on the architecture guide',
        ],
      },
      {
        version: 'v2.0.0',
        date: '2026-03-12',
        changes: ['Migrated to Turborepo 2', 'Reworked the design-token pipeline'],
      },
    ],
    roadmap: [
      { title: 'GitHub App repository invites', status: 'completed' },
      { title: 'One-click repository generation', status: 'in_progress', detail: 'Liem Launcher integration.' },
      { title: 'Kubernetes deploy recipe', status: 'planned' },
    ],
    reviews: [
      {
        author: 'Farrell A.',
        tier: 'Diamond',
        rating: 5,
        title: 'The fastest serious start',
        body: 'Saved a week of monorepo plumbing. The import boundaries keep the team honest.',
      },
    ],
  },
  {
    slug: 'liem-ai-plugin',
    name: 'Liem AI Plugin',
    tagline: 'Drop-in AI assist for the Liem developer workflow.',
    type: 'github',
    category: 'apps',
    priceIdr: 649000,
    version: 'v0.4.0',
    updatedAt: '2026-05-30',
    cover: preview1,
    githubRepo: 'liem/ai-plugin',
    requires: ['liem-monorepo'],
    overview: [
      'An AI assist layer that plugs into the Liem Monorepo to scaffold features, write contracts, and keep docs in sync.',
      'Requires Liem Monorepo. Checkout will let you add it if you do not own it yet.',
    ],
    features: [
      'Contract-first feature scaffolding',
      'Doc synchronization helpers',
      'Server-side model calls, never bundled into the app',
    ],
    changelog: [
      { version: 'v0.4.0', date: '2026-05-30', changes: ['Early access release', 'Feature scaffolder preview'] },
    ],
    roadmap: [
      { title: 'Feature scaffolder', status: 'in_progress' },
      { title: 'Inline review assist', status: 'planned' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-code',
    name: 'Liem Code',
    tagline: 'A focused desktop companion for managing your Liem projects.',
    type: 'free',
    category: 'apps',
    priceIdr: 0,
    version: 'v1.0.0',
    updatedAt: '2026-05-20',
    cover: preview2,
    overview: [
      'A free companion app to open, run, and manage Liem projects from one place.',
      'Claim it once and it stays in your library at no cost.',
    ],
    features: ['Project switcher', 'One-click dev scripts', 'Library sync (coming soon)'],
    changelog: [{ version: 'v1.0.0', date: '2026-05-20', changes: ['First public release'] }],
    roadmap: [
      { title: 'Project switcher', status: 'completed' },
      { title: 'Library sync', status: 'planned' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-prompt-pack',
    name: 'Liem Prompt Pack',
    tagline: 'Battle-tested prompts for building, reviewing, and shipping with AI agents.',
    type: 'download',
    category: 'prompts',
    priceIdr: 199000,
    version: 'v1.3.0',
    updatedAt: '2026-05-26',
    cover: preview3,
    overview: [
      'A curated set of prompts for scaffolding features, reviewing diffs, writing docs, and planning work with AI agents.',
      'Delivered as a downloadable pack in your library, updated as new prompts are added.',
    ],
    features: [
      'Feature, review, and planning prompt templates',
      'Copy-ready and organized by task',
      'Versioned updates as the pack grows',
    ],
    changelog: [
      { version: 'v1.3.0', date: '2026-05-26', changes: ['Added review and refactor prompts', 'Reorganized by task'] },
    ],
    roadmap: [
      { title: 'Task-organized library', status: 'completed' },
      { title: 'Per-stack variants', status: 'in_progress' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-agent-skills',
    name: 'Liem Agent Skills',
    tagline: 'Installable agent skills as Markdown files for your coding assistant.',
    type: 'github',
    category: 'skills',
    priceIdr: 249000,
    version: 'v0.6.0',
    updatedAt: '2026-05-29',
    cover: preview1,
    githubRepo: 'liem/agent-skills',
    overview: [
      'A collection of agent skills authored as `.md` files: install them into your assistant to add focused, repeatable capabilities.',
      'Delivered through GitHub: connect once and you get a repository invite, so pulling new skills is just a git pull.',
    ],
    features: [
      'Markdown skill files, no setup required',
      'Skills for review, docs, testing, and release',
      'Works with Claude-style skill loading',
    ],
    changelog: [
      { version: 'v0.6.0', date: '2026-05-29', changes: ['Added release and testing skills', 'Tightened skill triggers'] },
    ],
    roadmap: [
      { title: 'Core skill set', status: 'completed' },
      { title: 'Framework-specific skills', status: 'planned' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-ui-kit',
    name: 'Liem UI Kit',
    tagline: 'Reusable interface patterns tuned for calm, premium developer products.',
    type: 'download',
    category: 'templates',
    priceIdr: 499000,
    version: 'v0.9.0',
    updatedAt: '2026-05-10',
    cover: preview2,
    overview: [
      'A downloadable component and pattern library built on the same design tokens as Liem Center: open-band composition, restrained surfaces, and accessible focus states.',
      'Delivered as a versioned download in your library. New versions appear as product update notifications.',
    ],
    features: [
      'Token-driven components that drop into any Tailwind project',
      'Patterns for catalog, library, profile, and checkout surfaces',
      'Dark-mode-ready token sheet',
    ],
    changelog: [
      {
        version: 'v0.9.0',
        date: '2026-05-10',
        changes: ['Added status-pill and notification-drawer patterns', 'Refined focus-ring tokens'],
      },
    ],
    roadmap: [
      { title: 'Status pill set', status: 'completed' },
      { title: 'Data-table pattern', status: 'in_progress' },
      { title: 'Figma token sync', status: 'planned' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-starter-docs',
    name: 'Liem Starter Docs',
    tagline: 'The documentation starter for planning and operating a Liem project.',
    type: 'free',
    category: 'templates',
    priceIdr: 0,
    version: 'v1.2.0',
    updatedAt: '2026-04-22',
    cover: preview3,
    overview: [
      'A free, claimable documentation starter: PRD, features, and engineering docs structured for AI-assisted product builds.',
      'Claiming it adds a permanent entitlement to your library at no cost.',
    ],
    features: [
      'Product and engineering doc templates',
      'A docs-check script that keeps the system synchronized',
      'Opinionated structure proven across Liem products',
    ],
    changelog: [
      {
        version: 'v1.2.0',
        date: '2026-04-22',
        changes: ['Added payments and database domain docs', 'Clarified the auth-gating model'],
      },
    ],
    roadmap: [
      { title: 'Domain doc split', status: 'completed' },
      { title: 'Vertical playbooks', status: 'in_progress' },
      { title: 'Launch-readiness checklist', status: 'planned' },
    ],
    reviews: [],
  },
  {
    slug: 'liem-starter-bundle',
    name: 'Liem Starter Bundle',
    tagline: 'Monorepo, UI Kit, and Starter Docs together at a lower price.',
    type: 'bundle',
    category: 'bundle',
    priceIdr: 1099000,
    version: 'v1.0',
    updatedAt: '2026-05-28',
    cover: preview2,
    overview: [
      'Everything you need to start a Liem product: Liem Monorepo, Liem UI Kit, and Liem Starter Docs in one purchase.',
      'Already own part of the bundle? The price drops automatically to cover only what you are missing.',
    ],
    features: ['Includes Liem Monorepo', 'Includes Liem UI Kit', 'Includes Liem Starter Docs'],
    changelog: [{ version: 'v1.0', date: '2026-05-28', changes: ['Bundle launched'] }],
    roadmap: [{ title: 'Complete-your-collection pricing', status: 'completed' }],
    reviews: [],
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
