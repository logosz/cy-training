const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 800,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/mochawesome-report',
    overwrite: false,
    html: true,
    json: true
  }
});
