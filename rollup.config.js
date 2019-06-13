import { resolve } from 'path'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

// external dependencies:
// if we don't specify, rollup gives an 'unresolved' warning
const external = [
  // node builtin
  'url',
  // 3rd party
  '@hapi/boom',
  'twilio',
  // static json
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
    plugins: [sizeSnapshot()],
  },
  {
    external,
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      preferConst: true,
    },
    plugins: [sizeSnapshot()],
  },
]
