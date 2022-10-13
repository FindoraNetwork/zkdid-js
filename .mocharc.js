module.exports = {
  extension: ['js', 'ts', 'tsx'],
  loader: ['ts-node/esm'],
  recursive: 'test/**/*.test.ts',
  require: ['ts-node/register', 'tsconfig-paths/register.js', 'jsdom-global/register.js'],
  ui: 'bdd',
};
