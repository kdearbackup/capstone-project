import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: globals.browser, // Or node, etc., depending on your environment
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // Or an array of tsconfig files
      },
      globals: {
        ...globals.node, // Node.js globals for server-side code
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
      'prefer-const': 'error',
    },
  },
  tseslint.configs.recommended,
]);
