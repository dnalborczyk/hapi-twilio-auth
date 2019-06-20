import { resolve } from 'path'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const options = {
  // external dependencies:
  // if we don't specify, rollup gives an 'unresolved' warning
  external: [
    // node builtin
    'url',
    // 3rd party
    '@hapi/boom',
    'twilio',
    // static json
    resolve(__dirname, 'package.json'),
  ],
  input: 'src/index.js',
}

const preferConst = true

export default [
  {
    ...options,
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      preferConst,
    },
    plugins: [sizeSnapshot()],
  },
  {
    ...options,
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm',
      preferConst,
    },
    plugins: [sizeSnapshot()],
  },
]
