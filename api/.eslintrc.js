module.exports = {
    ...require('../eslintrc.base'),
    parserOptions: {
        project: `${__dirname}/../tsconfig.eslint.json`,
    },
};
