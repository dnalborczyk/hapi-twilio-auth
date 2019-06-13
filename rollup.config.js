import { resolve } from 'path'

// external dependencies:
// if we don't specify, rollup gives an 'unresolved' warning
const external = [
  // node own
  'url',
  // 3rd party
  '@hapi/boom',
  'twilio',
  // json
  resolve(__dirname, 'package.json'),
]

export default [
  {
    external,
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      preferConst: true,
    },
  },
  {
    external,
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      preferConst: true,
    },
  },
]
