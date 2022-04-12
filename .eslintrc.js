/* istanbul ignore next */

module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: "airbnb-base",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    rules: {
    },
    ignorePatterns: "['tests', '*.test.js']"
}
