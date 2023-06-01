module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  coverageThreshold: {
    global: {
      lines: 95,
    },
  },
};
