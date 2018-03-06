# Config override

This directory contains configuration files used by [react-app-rewired](https://github.com/timarney/react-app-rewired)
to alter default Webpack & Jest configuration provided by
[create-react-app](https://github.com/facebook/create-react-app).

- [`index.js`](./index.js) is the entry point linking to :
  - [`webpack.js`](./webpack.js) wich alters Webpack configuration,
  - [`jest.js`](./jest.js) alters Jest configuration.
- [`settings.js`](./settings.js) stores the values shared by the two previous
  files.
- [`less-overrides.less`](./less-overrides.less) allows defining variables
  for less CSS preprocessor.

## Rewirings

- [`react-app-rewire-less`](https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-less)
  - Enables [`less-loader`](https://github.com/webpack-contrib/less-loader)
- [`react-app-rewire-eslint`](https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-eslint)
  - Allows to use [`.eslintrc.*`](../.eslintrc.js) file instead of configuration
    bundled with `create-react-app`.
- [`react-app-rewire-sass-modules`](https://github.com/buzhanguo/react-app-rewire-sass-modules)
  - Enables [`sass-loader`](https://github.com/webpack-contrib/sass-loader)
- [`react-app-rewire-import`](https://github.com/brianveltman/react-app-rewire-import)
  - Enables [`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import)
    which allows using simple imports for Ant Design components scripts & styles.
- [`react-app-rewire-hot-loader`](https://github.com/cdharris/react-app-rewire-hot-loader)
  - Enables [`react-hot-loader`](https://github.com/gaearon/react-hot-loader)
