module.exports = {
  extends: 'makina',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node:    { paths: [ 'core_modules' ] },
      webpack: { paths: [ 'core_modules' ] },
    },
  },
};
