'use strict'

module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'eslint-config-prettier',
  ],

  plugins: ['prettier'],

  // http://eslint.org/docs/user-guide/configuring#specifying-parser
  // enables additional future ECMA language features https://github.com/tc39/proposals
  // e.g.:
  // jsx http://facebook.github.io/jsx/
  // flow types https://flowtype.org/
  parser: 'babel-eslint',
}
