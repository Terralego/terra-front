const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

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
  ],

  // Custom rules
  rules: {
    'operator-linebreak':                [off],
    'react/destructuring-assignment':    [error],
    'react/no-this-in-sfc':              [error],
    'react/no-access-state-in-setstate': [error],
  }
};
