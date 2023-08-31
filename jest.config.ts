export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
    },
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],
    coverageReporters: ["lcov", "text-summary"],
  };
  