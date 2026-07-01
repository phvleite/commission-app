module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },

  moduleFileExtensions: ["js", "jsx"],

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],

  roots: ["<rootDir>/tests"]
};
