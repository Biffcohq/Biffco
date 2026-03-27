// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

export default [js.configs.recommended, {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: tsParser,
    parserOptions: { project: './tsconfig.json' }
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    'import': importPlugin
  },
  rules: {
    // ─── LA REGLA MÁS IMPORTANTE DEL PROYECTO ────────────────
    // packages/core NUNCA puede importar packages/verticals/*
    // Viola esta regla = PR rechazado = fin de la conversación.
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['**/verticals/**', '@biffco/verticals/**'],
          message: 'El Core no puede importar Vertical Packs. Ver ADR-001.'
        }
      ]
    }],
    // ─── TypeScript estricto ──────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    // ─── Imports ──────────────────────────────────────────────
    'import/no-cycle': 'error',
    'import/no-self-import': 'error'
  }
}, // La regla de no-restricted-imports se aplica específicamente a packages/core
{
  files: ["packages/core/**/*.ts"],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['**/verticals/**', '@biffco/verticals/**', '@biffco/livestock', '@biffco/mining'],
          message: 'INVARIANTE ARQUITECTÓNICO: packages/core no puede importar ningún VerticalPack. Ver ADR-001.'
        }
      ]
    }]
  }
}, ...storybook.configs["flat/recommended"]];
