const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  root: true,
  extends: 'makina',
  overrides: [
    {
      files: ['src/stories/**/*.js', '.storybook/**'],
      rules: {
        'import/no-extraneous-dependencies': [off],
        'global-require':                    [off],
      },
    },
  ],

  // Custom rules
  rules: {
    'operator-linebreak':                [off],
    'react/destructuring-assignment':    [error],
    'react/no-this-in-sfc':              [error],
    'react/no-access-state-in-setstate': [error],
  }
};
