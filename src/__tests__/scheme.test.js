import hapi from '@hapi/hapi'
import plugin from '../index.js'

const { Server } = hapi

describe('scheme options', () => {
  let server

  beforeEach(async () => {
    delete process.env.TWILIO_AUTH_TOKEN
    server = new Server()

    return server.register(plugin)
  })

  afterEach(() => {
    return server.stop()
  })

  test('should work when twilio auth token and url is provided', () => {
    expect(() =>
      server.auth.strategy('twilio-auth', 'twilio-signature', {
        authToken: 'foo',
        url: 'http://www.foo.com',
      }),
    ).not.toThrow()
  })

  test('should work if twilio auth token is provided in environement', () => {
    process.env.TWILIO_AUTH_TOKEN = 'foo'

    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        url: 'http://www.foo.com',
      }),
    ).not.toThrow()
  })

  test('should fail if twilio auth token is not provided', () => {
    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        url: 'http://www.foo.com',
      }),
    ).toThrow('Twilio "authToken" is required for webhook request validation.')
  })

  test('should fail if url is not provided', () => {
    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        authToken: 'foo',
      }),
    ).toThrow('Twilio "url" is required for webhook request validation.')
  })
})
