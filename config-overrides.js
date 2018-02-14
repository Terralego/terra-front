/* eslint
  import/no-extraneous-dependencies: off,
  no-param-reassign: off,
*/

const rewireEslint = require('react-app-rewire-eslint');
const rewireLess   = require('react-app-rewire-less');
const rewireSass   = require('react-app-rewire-sass-modules');

module.exports = function override (config, env) {
  config = rewireEslint(config, env);
  config = rewireLess(config, env);
  config = rewireSass(config, env);

  return config;
};
