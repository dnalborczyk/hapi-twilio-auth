'use strict' // eslint-disable-line

const { NODE_ENV } = process.env

// jest sets NODE_ENV to 'test' by default
const isTest = NODE_ENV === 'test'

const plugins = ['@babel/plugin-transform-flow-strip-types']

if (isTest) {
  plugins.push('@babel/plugin-transform-modules-commonjs')
}

module.exports = {
  plugins,
}
