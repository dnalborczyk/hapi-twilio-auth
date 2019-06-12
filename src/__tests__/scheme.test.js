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

  test('should work when twilio auth token and baseUrl is provided', () => {
    expect(() =>
      server.auth.strategy('twilio-auth', 'twilio-signature', {
        authToken: 'foo',
        baseUrl: 'http://www.foo.com',
      }),
    ).not.toThrow()
  })

  test('should work if twilio auth token is provided in environement', () => {
    process.env.TWILIO_AUTH_TOKEN = 'foo'

    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        baseUrl: 'http://www.foo.com',
      }),
    ).not.toThrow()
  })

  test('should fail if twilio auth token is not provided', () => {
    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        baseUrl: 'http://www.foo.com',
      }),
    ).toThrow(
      'Twilio "authToken" is required for webhook request authentication.',
    )
  })

  test('should fail if baseUrl is not provided', () => {
    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        authToken: 'foo',
      }),
    ).toThrow(
      'Twilio "baseUrl" is required for webhook request authentication.',
    )
  })

  test('should fail if baseUrl is not a valid URL', () => {
    expect(() =>
      server.auth.strategy('twilio', 'twilio-signature', {
        authToken: 'foo',
        baseUrl: 'foo',
      }),
    ).toThrow('Twilio "baseUrl" is not a valid URL.')
  })
})
