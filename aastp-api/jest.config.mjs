export default {
    testEnvironment: "node",

    roots: [
        "<rootDir>/tests"
    ],

    testMatch: [
        "**/*.test.js"
    ],

    moduleNameMapper: {

        "^@tests/(.*)$":
            "<rootDir>/tests/$1"
    }
};