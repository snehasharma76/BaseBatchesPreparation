/**
 * ESLint Configuration
 * 
 * Linting configuration for code quality and consistency.
 * Uses ESLint 9+ flat config format with React-specific rules.
 * 
 * Key features:
 * - JavaScript recommended rules
 * - React Hooks best practices
 * - React Fast Refresh compatibility
 * - Custom rules for unused variables
 * 
 * @see https://eslint.org/docs/latest/use/configure/
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output directory
  globalIgnores(['dist']),
  
  {
    // Apply to all JavaScript and JSX files
    files: ['**/*.{js,jsx}'],
    
    // Extend recommended configurations
    extends: [
      js.configs.recommended,                    // ESLint recommended rules
      reactHooks.configs['recommended-latest'],  // React Hooks rules
      reactRefresh.configs.vite,                 // Vite Fast Refresh rules
    ],
    
    // Language options
    languageOptions: {
      ecmaVersion: 2020,           // Support modern JavaScript features
      globals: globals.browser,    // Browser global variables
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module',        // Use ES modules
      },
    },
    
    // Custom rules
    rules: {
      // Allow unused variables that start with uppercase or underscore
      // Useful for React components and constants
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
