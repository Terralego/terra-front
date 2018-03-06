
0.4.0 / 2018-03-07
==================

  * Add README file for `config-overrides`
  * Upgrade default version of `eslint-config-makina`
  * Explain Webpack overrides through `config-overrides`
  * Split up `config-overrides` in subfiles
  * Move `config-overrides` to a dedicated directory
  * Extend Webpack includes dir for modules rules
  * Add `custom_modules` for imports lookup directory
  * Offer the ability to load components with absolute imports
  * Push dummy components About & Home to dedicated files
  * Create basic `settings` module in `core_modules`
  * Add `core_modules` for imports lookup directory
  * Enable rewiring for Jest config

0.3.0 / 2018-03-02
==================

  * Define CI basic workflow for Gitlab CI
  * Upgrade default version of `eslint-config-makina`
  * Add a lint script to `package.json`
  * Add `build` & `node_modules` directories to eslint ignore list
  * Remove eject script from `package.json`
  * Add explicitely moment.js to dependency

0.2.0 / 2018-02-23
==================

  * Setup a base layout with antd components
  * Add Ant Design LocalProvider
  * Reorganize config-overrides to better readability
  * Enable React Hot Loader by rewiring
  * Explain how to override AntD less variables in README
  * Provide a file for overriding less variables
  * Add Ant Design library & react-app-rewire-import
  * Move Redux & Router one file level down inside App.js
  * Extract eslint config to a dedicated package: eslint-config-makina
  * Setup Redux & Connecter router
  * Enable `to={}` as special link for router links in eslintrc

0.1.0 / 2018-02-16
==================

  * Add version script to improve versioning workflow
  * Create basic README
  * Allow forcing build with linting errors
  * Add react-app-rewire for eslint, scss & less
  * Ignore `registerServiceWorker.js` from eslint scope
  * Cleanup base files
  * Setup create-react-app
  * Define base configuration
