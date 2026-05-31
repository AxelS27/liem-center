import globals from 'globals';

import base, { noAppImports } from './base.js';

// Generic-AI visual tells that lint can catch in class strings: patterns
// docs/FRONTEND.md forbids, turned into lint errors so they cannot ship. Matched on
// string literals and template chunks, so className="...", cn('...'), and `...` class
// strings are all covered. This is enforcement the FRONTEND.md self-review can't be:
// a green build won't let these through.
const aiTellSyntax = [
  {
    selector:
      'Literal[value=/\\b(min-h-screen|h-screen)\\b|\\b100[sdl]?vh\\b/], TemplateElement[value.raw=/\\b(min-h-screen|h-screen)\\b|\\b100[sdl]?vh\\b/]',
    message:
      'Do not force a section to viewport height (min-h-screen / h-screen / 100vh). Height should come from real content and spacing, not a fixed viewport unit. See docs/FRONTEND.md.',
  },
  {
    selector:
      'Literal[value=/\\b(bg|text|border|ring|from|via|to|fill|stroke|divide|outline|decoration|shadow|caret|accent)-(zinc|slate|gray|neutral|stone|violet|indigo|purple|fuchsia)-/], TemplateElement[value.raw=/\\b(bg|text|border|ring|from|via|to|fill|stroke|divide|outline|decoration|shadow|caret|accent)-(zinc|slate|gray|neutral|stone|violet|indigo|purple|fuchsia)-/]',
    message:
      'Use semantic token classes (bg-background, text-muted-foreground, border-border, ...), not raw Tailwind palette classes. Bare neutrals and default violet/indigo are generic-AI tells; color lives in globals.css.',
  },
  {
    selector:
      'Literal[value=/(bg|text|border|ring|from|via|to|fill|stroke|shadow|decoration|outline|caret)-\\[#/], TemplateElement[value.raw=/(bg|text|border|ring|from|via|to|fill|stroke|shadow|decoration|outline|caret)-\\[#/]',
    message:
      'No hardcoded hex in className (e.g. bg-[#1a1a1a]). Add a token in globals.css and use it instead of inlining a color.',
  },
];

export default [
  ...base,
  {
    ignores: ['next-env.d.ts', '.next/**'],
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Block the most common generic-AI visual tells at lint time (see above).
      'no-restricted-syntax': ['error', ...aiTellSyntax],
      // Extend the app-boundary rule with feature isolation: a feature may only be
      // imported through its public index, never its internals.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...noAppImports.patterns,
            {
              group: ['@/features/*/*'],
              message:
                'Import a feature only through its public index (e.g. "@/features/auth"), never its internals.',
            },
          ],
        },
      ],
    },
  },
];
