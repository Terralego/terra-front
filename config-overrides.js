/* eslint
  import/no-extraneous-dependencies: off,
  no-param-reassign: off,
*/

const rewireEslint = require('react-app-rewire-eslint');
const rewireLess   = require('react-app-rewire-less');
const rewireSass   = require('react-app-rewire-sass-modules');
const rewireImport = require('react-app-rewire-import');

module.exports = function override (config, env) {
  config = rewireEslint(config, env, options => {
    options.emitWarning = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_FORCE_BUILD;
    return options;
  });
  config = rewireImport(config, env, { libraryName: 'antd', libraryDirectory: 'es', style: true });
  config = rewireLess(config, env);
  config = rewireSass(config, env);

  return config;
};
