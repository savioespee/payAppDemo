const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'jest'],
  parserOptions: {
    sourceType: 'module',
    babelOptions: { configFile: path.join(__dirname, 'babel.config.js') },
  },
  extends: ['@react-native-community', 'plugin:react-hooks/recommended'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-catch-shadow': 'off',
    'no-shadow': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'no-use-before-define': ['error', { variables: false }],
    'prefer-template': 'error',
    '@typescript-eslint/no-shadow': 'off',
  },
};
