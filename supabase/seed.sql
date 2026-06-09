-- Seed data for local Supabase development.
-- Keep this deterministic and safe to run after `supabase db reset`.
-- Products upsert on slug; child rows are guarded so re-applying does not duplicate.

insert into public.products
  (slug, name, tagline, type, category, price_idr, version, github_repo, status, published_at, overview, features, how_to_use)
values
  (
    'liem-monorepo', 'Liem Monorepo',
    'A production-grade TypeScript monorepo foundation for serious product builds.',
    'github', 'repos', 799000, 'v2.1.0', 'liem/monorepo', 'published', timestamptz '2026-05-28',
    array[
      'Liem Monorepo is the opinionated starting point behind every Liem product: pnpm workspaces, Turborepo, strict TypeScript, and enforced import boundaries out of the box.',
      'Buying it creates a permanent entitlement on your account. Connect GitHub once and you receive an automatic repository invitation, so access feels native to your workflow.'
    ],
    array[
      'pnpm + Turborepo workspace wired for web, server, and shared packages',
      'Strict TypeScript base config and flat ESLint with import-boundary rules',
      'Hono API skeleton with Zod-validated contracts in packages/types',
      'Supabase auth, database, and storage pre-wired'
    ],
    array[
      'Clone your repo: git clone https://github.com/axels27/liem-monorepo <project-name>',
      'Install and run: pnpm install, then pnpm dev.',
      'New project: prompt your agent "Read AGENTS.md and docs/guides/INIT.md, then initialize from my brief: ..."',
      'Continuing later: prompt your agent "Read AGENTS.md and docs/engineering/PROGRESS.md, then continue with: <task>"'
    ]
  ),
  (
    'liem-ai-plugin', 'Liem AI Plugin',
    'Drop-in AI assist for the Liem developer workflow.',
    'github', 'apps', 649000, 'v0.4.0', 'liem/ai-plugin', 'published', timestamptz '2026-05-30',
    array[
      'An AI assist layer that plugs into the Liem Monorepo to scaffold features, write contracts, and keep docs in sync.',
      'Requires Liem Monorepo. Checkout will let you add it if you do not own it yet.'
    ],
    array[
      'Contract-first feature scaffolding',
      'Doc synchronization helpers',
      'Server-side model calls, never bundled into the app'
    ],
    array[
      'In your Liem Monorepo, install the plugin following the repo README.',
      'Register it in your agent config.',
      'Prompt your agent "scaffold a feature for <X>" and it writes the contracts and docs.'
    ]
  ),
  (
    'liem-code', 'Liem Code',
    'A focused desktop companion for managing your Liem projects.',
    'free', 'apps', 0, 'v1.0.0', null, 'published', timestamptz '2026-05-20',
    array[
      'A free companion app to open, run, and manage Liem projects from one place.',
      'Claim it once and it stays in your library at no cost.'
    ],
    array['Project switcher', 'One-click dev scripts', 'Library sync (coming soon)'],
    array[
      'Open Liem Code and point it at your project folder.',
      'Use the project switcher to jump between your Liem projects.',
      'Run dev scripts with one click instead of memorizing commands.'
    ]
  ),
  (
    'liem-prompt-pack', 'Liem Prompt Pack',
    'Battle-tested prompts for building, reviewing, and shipping with AI agents.',
    'download', 'prompts', 199000, 'v1.3.0', null, 'published', timestamptz '2026-05-26',
    array[
      'A curated set of prompts for scaffolding features, reviewing diffs, writing docs, and planning work with AI agents.',
      'Delivered as a downloadable pack in your library, updated as new prompts are added.'
    ],
    array[
      'Feature, review, and planning prompt templates',
      'Copy-ready and organized by task',
      'Versioned updates as the pack grows'
    ],
    array[
      'Pick the prompt for your task: feature, review, or planning.',
      'Paste it into your AI assistant and replace the placeholders.',
      'Refine with the follow-up prompts included in the pack.'
    ]
  ),
  (
    'liem-agent-skills', 'Liem Agent Skills',
    'Installable agent skills as Markdown files for your coding assistant.',
    'github', 'skills', 249000, 'v0.6.0', 'liem/agent-skills', 'published', timestamptz '2026-05-29',
    array[
      'A collection of agent skills authored as .md files: install them into your assistant to add focused, repeatable capabilities.',
      'Delivered through GitHub: connect once and you get a repository invite, so pulling new skills is just a git pull.'
    ],
    array[
      'Markdown skill files, no setup required',
      'Skills for review, docs, testing, and release',
      'Works with Claude-style skill loading'
    ],
    array[
      'Copy the .md skill files into your assistant skills folder.',
      'Reload your assistant so it loads the new skills.',
      'Trigger a skill by describing the task, e.g. "review this diff".'
    ]
  ),
  (
    'liem-ui-kit', 'Liem UI Kit',
    'Reusable interface patterns tuned for calm, premium developer products.',
    'download', 'templates', 499000, 'v0.9.0', null, 'published', timestamptz '2026-05-10',
    array[
      'A downloadable component and pattern library built on the same design tokens as Liem Center: open-band composition, restrained surfaces, and accessible focus states.',
      'Delivered as a versioned download in your library. New versions appear as product update notifications.'
    ],
    array[
      'Token-driven components that drop into any Tailwind project',
      'Patterns for catalog, library, profile, and checkout surfaces',
      'Dark-mode-ready token sheet'
    ],
    array[
      'Copy the component files into your project components folder.',
      'Add the design tokens to your globals.css.',
      'Import a component and drop it into a page.'
    ]
  ),
  (
    'liem-starter-docs', 'Liem Starter Docs',
    'The documentation starter for planning and operating a Liem project.',
    'free', 'templates', 0, 'v1.2.0', null, 'published', timestamptz '2026-04-22',
    array[
      'A free, claimable documentation starter: PRD, features, and engineering docs structured for AI-assisted product builds.',
      'Claiming it adds a permanent entitlement to your library at no cost.'
    ],
    array[
      'Product and engineering doc templates',
      'A docs-check script that keeps the system synchronized',
      'Opinionated structure proven across Liem products'
    ],
    array[
      'Copy the docs/ folder into your repo.',
      'Fill PRD.md and FEATURES.md with your product scope.',
      'Run pnpm docs:check to keep the docs in sync.'
    ]
  ),
  (
    'liem-starter-bundle', 'Liem Starter Bundle',
    'Monorepo, UI Kit, and Starter Docs together at a lower price.',
    'bundle', 'bundle', 1099000, 'v1.0', null, 'published', timestamptz '2026-05-28',
    array[
      'Everything you need to start a Liem product: Liem Monorepo, Liem UI Kit, and Liem Starter Docs in one purchase.',
      'Already own part of the bundle? The price drops automatically to cover only what you are missing.'
    ],
    array['Includes Liem Monorepo', 'Includes Liem UI Kit', 'Includes Liem Starter Docs'],
    array[
      'Start with Liem Monorepo: clone it and run pnpm install.',
      'Add the UI Kit components and design tokens.',
      'Use the Starter Docs to plan and operate the project.'
    ]
  )
on conflict (slug) do nothing;

-- Product dependency: AI Plugin requires Monorepo.
insert into public.product_dependencies (product_id, required_product_id)
select p.id, r.id
from public.products p
join public.products r on r.slug = 'liem-monorepo'
where p.slug = 'liem-ai-plugin'
on conflict do nothing;

-- Changelog entries (guarded so re-apply does not duplicate).
insert into public.changelog_entries (product_id, version, released_at, changes)
select p.id, v.version, v.released_at::date, v.changes
from public.products p
join (values
  ('liem-monorepo', 'v2.1.0', '2026-05-28', array['Added GitHub App based repository invites', 'Improved Docker compose for local Supabase', 'Documentation pass on the architecture guide']),
  ('liem-monorepo', 'v2.0.0', '2026-03-12', array['Migrated to Turborepo 2', 'Reworked the design-token pipeline']),
  ('liem-ai-plugin', 'v0.4.0', '2026-05-30', array['Early access release', 'Feature scaffolder preview']),
  ('liem-code', 'v1.0.0', '2026-05-20', array['First public release']),
  ('liem-prompt-pack', 'v1.3.0', '2026-05-26', array['Added review and refactor prompts', 'Reorganized by task']),
  ('liem-agent-skills', 'v0.6.0', '2026-05-29', array['Added release and testing skills', 'Tightened skill triggers']),
  ('liem-ui-kit', 'v0.9.0', '2026-05-10', array['Added status-pill and notification-drawer patterns', 'Refined focus-ring tokens']),
  ('liem-starter-docs', 'v1.2.0', '2026-04-22', array['Added payments and database domain docs', 'Clarified the auth-gating model']),
  ('liem-starter-bundle', 'v1.0', '2026-05-28', array['Bundle launched'])
) as v(slug, version, released_at, changes) on v.slug = p.slug
where not exists (
  select 1 from public.changelog_entries c where c.product_id = p.id and c.version = v.version
);

-- Roadmap items (guarded so re-apply does not duplicate).
insert into public.roadmap_items (product_id, title, status, position)
select p.id, v.title, v.status::public.roadmap_status, v.position
from public.products p
join (values
  ('liem-monorepo', 'GitHub App repository invites', 'completed', 0),
  ('liem-monorepo', 'One-click repository generation', 'in_progress', 1),
  ('liem-monorepo', 'Kubernetes deploy recipe', 'planned', 2),
  ('liem-ai-plugin', 'Feature scaffolder', 'in_progress', 0),
  ('liem-ai-plugin', 'Inline review assist', 'planned', 1),
  ('liem-prompt-pack', 'Task-organized library', 'completed', 0),
  ('liem-prompt-pack', 'Per-stack variants', 'in_progress', 1),
  ('liem-agent-skills', 'Core skill set', 'completed', 0),
  ('liem-agent-skills', 'Framework-specific skills', 'planned', 1),
  ('liem-ui-kit', 'Status pill set', 'completed', 0),
  ('liem-ui-kit', 'Data-table pattern', 'in_progress', 1),
  ('liem-starter-docs', 'Domain doc split', 'completed', 0),
  ('liem-starter-docs', 'Vertical playbooks', 'in_progress', 1)
) as v(slug, title, status, position) on v.slug = p.slug
where not exists (
  select 1 from public.roadmap_items r where r.product_id = p.id and r.title = v.title
);
