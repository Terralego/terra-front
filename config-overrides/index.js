/* eslint
  import/no-extraneous-dependencies: off,
  import/newline-after-import: off,
  no-param-reassign: off,
*/

const path = require('path');

const rewireEslint = require('react-app-rewire-eslint');
const rewireLess   = require('react-app-rewire-less');
const rewireSass   = require('react-app-rewire-sass-modules');
const rewireImport = require('react-app-rewire-import');
const rewireRHL    = require('react-app-rewire-hot-loader');

const rewireModulesIncludes = (config, env, paths) => {
  const crawl = obj => {
    obj.forEach(rule => {
      if (rule.oneOf) {
        crawl(rule.oneOf);
      } else if (rule.include && rule.include === path.resolve(__dirname, '../src')) {
        rule.include = paths;
      }
    });
  };

  crawl(config.module.rules);

  return config;
};

const lessOptions   = require('./less-overrides');
const importOptions = { libraryName: 'antd', libraryDirectory: 'es', style: true };
const eslintOptions = options => {
  options.emitWarning = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_FORCE_BUILD;
  return options;
};
const modulesPaths = [
  path.resolve(__dirname, '../custom_modules'),
  path.resolve(__dirname, '../src'),
  path.resolve(__dirname, '../core_modules'),
];

const webpack = function overrideWebpack (config, env) {
  config = rewireEslint(config, env, eslintOptions);
  config = rewireImport(config, env, importOptions);
  config = rewireLess.withLoaderOptions(lessOptions)(config, env);
  config = rewireSass(config, env);
  config = rewireRHL(config, env);
  config = rewireModulesIncludes(config, env, modulesPaths);

  config.resolve.symlinks = false;

  config.resolve.modules.unshift(...modulesPaths);

  return config;
};

const rewireJestModules = config => {
  if (!config.modulePaths) {
    config.modulePaths = [];
  }

  config.modulePaths.unshift(...modulesPaths);

  return config;
};

const jest = function overrideJest (config, env) {
  config = rewireJestModules(config, env);

  return config;
};

module.exports = {
  webpack,
  jest,
};
