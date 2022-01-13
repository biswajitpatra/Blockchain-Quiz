module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:jsx-a11y/strict',
        'plugin:prettier/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: ['react', 'react-hooks', 'jsx-a11y'],
    rules: {
        // NextJs specific fix: suppress errors for missing 'import React' in files for nextjs
        'react/react-in-jsx-scope': 'off',
        // NextJs specific fix: allow jsx syntax in js files
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], //should add ".ts" if typescript project
        'react/display-name': 1,
        'react-hooks/exhaustive-deps': 'error',
        'no-var': 'error',
        'brace-style': 'error',
        'prefer-template': 'error',
        radix: 'error',
        'space-before-blocks': 'error',
        'import/prefer-default-export': 'off',
        'react/prop-types': 0,
    },
    overrides: [
        {
            files: [
                '**/*.test.js',
                '**/*.test.jsx',
                '**/*.test.tsx',
                '**/*.spec.js',
                '**/*.spec.jsx',
                '**/*.spec.tsx',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
