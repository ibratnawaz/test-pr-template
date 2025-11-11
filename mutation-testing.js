{
  "$schema": "https://raw.githubusercontent.com/stryker-mutator/stryker/master/packages/core/schema/stryker-schema.json",
  "testRunner": "jest",
  "mutate": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/tests/**",
    "!src/main.tsx",
    "!src/vite-env.d.ts"
  ],
  "reporters": ["progress", "clear-text", "html"],
  "coverageAnalysis": "off",
  "timeoutMS": 60000,
  "concurrency": 4,
  "jest": {
    "projectType": "custom",
    "configFile": "jest.config.js"
  },
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.test.json",
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 0
  }
}

