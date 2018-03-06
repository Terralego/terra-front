module.exports = {
  extends: 'makina',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node:    { paths: [
        'src',
        'core_modules',
      ] },
      webpack: { paths: [
        'src',
        'core_modules',
      ] },
    },
  },
};
