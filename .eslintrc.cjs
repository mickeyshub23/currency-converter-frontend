module.exports = {
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  rules: {
    'no-unused-vars': 'off',
  },
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '.eslintrc.cjs'],
};