module.exports = {
  env: {
    browser: true,
    es2024: true,
    commonjs: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/stylistic'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint'],
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-promise-executor-return': 'off',
    'no-plusplus': 'off',
    'no-loop-func': 'off',
    'array-callback-return': 'error',
    'object-curly-newline': 'off',
    'max-len': ['error', { code: 140 }],
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-unused-vars': 'off',
    indent: 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
  },
  globals: {
    gv: 'readonly',
  },
};
