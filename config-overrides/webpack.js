/* eslint
  import/no-extraneous-dependencies: off,
  import/newline-after-import: off,
  no-param-reassign: off,
  import/no-unresolved: off,
  global-require: off,
*/

const path = require('path');
const settings = require('./settings.js');

const rewireEslint = require('react-app-rewire-eslint');
const rewireLess   = require('react-app-rewire-less');
const rewireCssModules = require('react-app-rewire-css-modules');
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

let lessOptions = {};
try {
  lessOptions = require('../custom_modules/less-overrides');
} catch (error) {
  lessOptions = require('./less-overrides');
}

const importOptions = { libraryName: 'antd', libraryDirectory: 'es', style: true };
const eslintOptions = options => {
  options.emitWarning = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_FORCE_BUILD;
  return options;
};

module.exports = function overrideWebpack (config, env) {
  /**
   * Allow the use of `.eslintrc.js` file instead of rules bundled with create-react-app
   * https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-eslint
   */
  config = rewireEslint(config, env, eslintOptions);

  /**
   * Enable short imports for Ant Design.
   * https://github.com/ant-design/babel-plugin-import
   */
  config = rewireImport(config, env, importOptions);

  /**
   * Add Less file loader & inject variables.
   * https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-less
   */
  config = rewireLess.withLoaderOptions(lessOptions)(config, env);

  /**
   * Add (S)CSS files (module) loader
   *https://github.com/codebandits/react-app-rewire-css-modules
   */
  config = rewireCssModules(config, env);

  /**
   * Enable Hot Loader
   * https://github.com/cdharris/react-app-rewire-hot-loader
   */
  config = rewireRHL(config, env);

  /**
   * Paths to include in loader rules
   * https://webpack.js.org/configuration/module/#rule-include
   */
  config = rewireModulesIncludes(config, env, settings.modulesPaths);

  /**
   * Whether to resolve symlinks to their symlinked location.
   * https://webpack.js.org/configuration/resolve/#resolve-symlinks
   */
  config.resolve.symlinks = false;

  /**
   * Tell webpack what directories should be searched when resolving modules.
   * https://webpack.js.org/configuration/resolve/#resolve-modules
   */
  config.resolve.modules.unshift(...settings.modulesPaths);

  return config;
};
