module.exports = {
  root: true,
  extends: 'makina',
  overrides: [
    {
      files: ['src/stories/**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': [0],
      },
    },
  ]
};
