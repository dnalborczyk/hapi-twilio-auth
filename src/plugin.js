// @flow strict

import scheme from './scheme.js'
import pkg from '../package.json'

export default {
  // name and version will be loaded from package.json
  pkg,
  register(server: any) {
    server.auth.scheme('twilio-signature', scheme)
  },
}
