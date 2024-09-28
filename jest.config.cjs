module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest', // If you're using TypeScript
  },
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'], // Only treat .ts as ESM
};
