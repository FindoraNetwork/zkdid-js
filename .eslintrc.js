module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb/hooks',
    'prettier',
    //  eslint-plugin-react
    'prettier/react',
    //  @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-var': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'react/button-has-type': 'never',
    'react/prop-types': 'never',
    'react/sort-comp': 'never',
    'import/extensions': 'never',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-duplicates': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.less', '.jsx', '.ts', '.tsx', '.json', '.jsonc', '.wasm'],
      },
      alias: {
        map: [
          ['_src', path.resolve(__dirname, './src/')],
          ['_components', path.resolve(__dirname, './src/components/')],
          ['_containers', path.resolve(__dirname, './src/containers/')],
          ['_constants', path.resolve(__dirname, './src/constants/')],
          ['_utils', path.resolve(__dirname, './src/utils/')],
          ['_assets', path.resolve(__dirname, 'src/assets/')],
        ],
        extensions: ['.js', '.less', '.jsx', '.ts', '.tsx', '.json', '.jsonc', '.wasm'],
      },
    },
  },
};
