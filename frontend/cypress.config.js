/**
 * Cypress E2E test configuration.
 * Targets the frontend dev server at localhost:3000 and picks up specs
 * from cypress/integration/ to match the exercise's folder convention.
 * supportFile is disabled — no global setup file is needed.
 * @module cypress.config
 */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.{js,ts}',
    supportFile: false,
  },
});
