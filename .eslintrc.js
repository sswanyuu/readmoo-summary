module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    webextensions: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off', // Allow console statements in Chrome extensions for debugging
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prettier/prettier': 'warn'
  },
  globals: {
    chrome: 'readonly',
    browser: 'readonly'
  }
}
