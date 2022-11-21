module.exports = {
  env: {
    node: true,
    "jest/globals": true
  },
  parserOptions: {
    'project': ['./tsconfig.json'],
    'tsconfigRootDir': __dirname,
    'sourceType': 'module',
    'ecmaVersion': 2020
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'jest', 'prettier'],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
      '.ts',
      '.tsx'
    ]
    },
    'import/resolver': {
      'typescript': {}
    }
  },

  overrides: [
    {
      files: ['**/*.spec.ts'],
      plugins: ['jest'],
      rules: {
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
  ],

  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-return-await': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'jest/consistent-test-it': 'error',
    'jest/no-duplicate-hooks': 'error',
    'jest/no-if': 'error',
    'jest/no-test-return-statement': 'error',
    'jest/prefer-expect-resolves': 'error',
    'jest/prefer-hooks-on-top': 'error',
    'jest/prefer-todo': 'error',
    'jest/require-top-level-describe': 'error',
    'jest/unbound-method': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: true,
        allowNullish: true
      }
    ],
    'no-restricted-modules': [
      'error',
      {
        name: 'bluebird',
        message: 'Use native promise options instead'
      },
      {
        name: 'underscore',
        message: 'Use lodash or lodash-es instead'
      },
      {
        name: 'moment',
        message: 'Please use date-fns instead - https://github.com/you-dont-need/You-Dont-Need-Momentjs'
      }
    ]
  }
}
