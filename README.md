# hapi-twilio-auth

[Hapi](https://github.com/hapijs/hapi) plugin for [Twilio](https://github.com/twilio/twilio-node) request validation.

<p>
  <a href="https://www.npmjs.com/package/hapi-twilio-auth"><img src="https://img.shields.io/npm/v/hapi-twilio-auth.svg?style=flat-square"></a>
  <a href="https://travis-ci.com/dnalborczyk/hapi-twilio-auth"><img src="https://img.shields.io/travis/dnalborczyk/hapi-twilio-auth.svg?style=flat-square"></a>
  <img src="https://img.shields.io/node/v/hapi-twilio-auth.svg?style=flat-square">
  <img src="https://img.shields.io/npm/dependency-version/hapi-twilio-auth/peer/@hapi/hapi.svg?style=flat-square">
  <img src="https://img.shields.io/npm/dependency-version/hapi-twilio-auth/peer/twilio.svg?style=flat-square">
  <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  <img src="https://img.shields.io/npm/l/hapi-twilio-auth.svg?style=flat-square">
</p>

### install

```cli
npm i hapi-twilio-auth
```

### usage

```js
import hapi from '@hapi/hapi'
import hapiTwilioAuth from 'hapi-twilio-auth'

const { Server } = hapi

async function startServer() {
  const server = new Server({
    port: 3000,
  })

  await server.register(hapiTwilioAuth)

  server.auth.strategy('twilio-auth', 'twilio-signature', {
    baseUrl: 'https://mycompany.com/webhooks-path', // your twilio webhooks base url
    twilioAuthToken: 'xxxxxxxxxxx', // your twilio auth token
  })

  server.route({
    method: 'POST',
    path: '/',
    handler(request, h) {
      // ...
    },
  })

  await server.start()
}

startServer()
```
