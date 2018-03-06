module.exports = {
  extends: 'makina',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node:    { paths: [
        'custom_modules',
        'src',
        'core_modules',
      ] },
      webpack: { paths: [
        'custom_modules',
        'src',
        'core_modules',
      ] },
    },
  },
};
