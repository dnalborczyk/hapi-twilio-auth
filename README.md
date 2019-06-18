# hapi-twilio-auth

[Hapi](https://github.com/hapijs/hapi) plugin for [Twilio](https://github.com/twilio/twilio-node) request validation.

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
    path:'/',
    handler(request, h) {
      // ...
    },
  });

  await server.start()
}

startServer()
```
