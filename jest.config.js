module.exports = {
  collectCoverageFrom: ["src/**/*"],
  coverageReporters: ["text", "text-summary", "json-summary", "lcovonly"],
  reporters: ["default", "jest-junit"],
};
