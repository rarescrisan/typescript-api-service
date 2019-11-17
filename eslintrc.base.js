const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        '@jakedeichert/eslint-config',
        'plugin:@typescript-eslint/recommended',
    ],

    env: {
        jest: true,
        node: true,
    },

    rules: {
        '@typescript-eslint/indent': OFF, // Prettier handles formatting
        '@typescript-eslint/no-use-before-define': [
            ERROR,
            { functions: false },
        ],
    },
};
