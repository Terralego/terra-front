const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
  },
  rules: {
    'arrow-parens':                      [error, 'as-needed'],
    'camelcase':                         [warn],
    'no-param-reassign':                 [warn],
    'object-curly-newline':              [warn, { multiline: true }],
    'prefer-template':                   [warn],
    'space-before-function-paren':       [error, always],

    'import/extensions':                 [warn],
    'import/no-extraneous-dependencies': [warn],
    'import/no-unresolved':              [warn],

    'jsx-a11y/anchor-is-valid':          [error, { specialLink: ['to'] }],

    'react/prefer-stateless-function':   [warn],
    'react/jsx-filename-extension':      [warn, { 'extensions': ['.js', '.jsx'] }],

    'no-multi-spaces': [
      warn,
      {
        exceptions: {
          Property:           true,
          VariableDeclarator: true,
          ImportDeclaration:  true,
          BinaryExpression:   true,
        },
      },
    ],

    'no-unused-expressions': [
      warn,
      {
        allowShortCircuit:    true,
        allowTernary:         true,
        allowTaggedTemplates: true,
      },
    ],
  },
};
