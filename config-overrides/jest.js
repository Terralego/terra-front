/* eslint
  import/no-extraneous-dependencies: off,
  import/newline-after-import: off,
  no-param-reassign: off,
*/

const settings = require('./settings.js');

const rewireJestModules = config => {
  if (!config.modulePaths) {
    config.modulePaths = [];
  }

  config.modulePaths.unshift(...settings.modulesPaths);

  return config;
};

module.exports = function overrideJest (config, env) {
  config = rewireJestModules(config, env);

  return config;
};
