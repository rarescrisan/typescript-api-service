const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        '@jakedeichert/eslint-config',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['@typescript-eslint'],

    parserOptions: {
        project: './tsconfig.json',
    },

    env: {
        jest: true,
    },

    rules: {
        // Disable some things prettier takes care of
        '@typescript-eslint/indent': OFF,
    },
};