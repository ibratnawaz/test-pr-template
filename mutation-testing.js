// npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner typescript ts-jest

module.exports = function(config) {
  config.set({
    mutator: {
      name: 'typescript',
      excludedMutations: ['BooleanSubstitution'] // optional tuning
    },
    packageManager: 'npm',
    reporters: ['progress', 'clear-text', 'html'],
    testRunner: 'jest',
    jest: {
      projectType: 'custom',
      config: require('./jest.config.js')
    },
    mutate: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/index.{ts,tsx}'],
    concurrency: Math.max(1, Math.floor(require('os').cpus().length / 2)),
    timeoutMS: 600000,
    coverageAnalysis: 'perTest', // or 'off' for faster but less precise results
  });
};
