import hapi from '@hapi/hapi'
import twilio from 'twilio/lib/webhooks/webhooks.js'
import plugin from '../index.js'

const { Server } = hapi
const { getExpectedTwilioSignature } = twilio

describe('request', () => {
  let server

  beforeEach(async () => {
    server = new Server()

    server.register(plugin)

    server.auth.strategy('twilio', 'twilio-signature', {
      authToken: 'foobar',
      baseUrl: 'http://localhost',
    })
  })

  afterEach(() => {
    return server.stop()
  })

  test('should return 400 "Bad Request" when header is not provided', async () => {
    const request = {
      method: 'GET',
      url: '/test',
    }

    server.route({
      method: 'GET',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const {
      statusCode,
      result: { error, message },
    } = await server.inject(request)

    expect(statusCode).toBe(400)
    expect(error).toBe('Bad Request')
    expect(message).toBe(
      'Missing header "X-Twilio-Signature" for Twilio authentication.',
    )
  })

  test('should return 401 "Unauthorized" when header has empty value', async () => {
    const request = {
      method: 'GET',
      url: '/test',
      headers: { 'X-Twilio-Signature': '' },
    }

    server.route({
      method: 'GET',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const {
      statusCode,
      result: { error, message },
    } = await server.inject(request)

    expect(statusCode).toBe(401)
    expect(error).toBe('Unauthorized')
    expect(message).toBe('Invalid "X-Twilio-Signature".')
  })

  test('should return 401 "Unauthorized" with incorrect header', async () => {
    const request = {
      method: 'GET',
      url: '/test',
      headers: { 'X-Twilio-Signature': 'foobar' },
    }

    server.route({
      method: 'GET',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const {
      statusCode,
      result: { error, message },
    } = await server.inject(request)

    expect(statusCode).toBe(401)
    expect(error).toBe('Unauthorized')
    expect(message).toBe('Invalid "X-Twilio-Signature".')
  })

  test('should return 401 "Unauthorized" with incorrect header and payload', async () => {
    const request = {
      method: 'POST',
      url: '/test',
      payload: {},
      headers: { 'X-Twilio-Signature': 'foobar' },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const {
      statusCode,
      result: { error, message },
    } = await server.inject(request)

    expect(statusCode).toBe(401)
    expect(error).toBe('Unauthorized')
    expect(message).toBe('Invalid "X-Twilio-Signature".')
  })

  test('should return 200 reponse with correct header', async () => {
    const url = 'http://localhost/test'

    const twilioHeader = getExpectedTwilioSignature('foobar', url, {})

    const request = {
      method: 'GET',
      url: '/test',
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'GET',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const { result, statusCode } = await server.inject(request)

    expect(statusCode).toBe(200)
    expect(result).toEqual({})
  })

  test('should return 200 reponse with correct header and payload null', async () => {
    const url = 'http://localhost/test'

    const twilioHeader = getExpectedTwilioSignature('foobar', url, {})

    const request = {
      method: 'POST',
      url: '/test',
      payload: null,
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const { result, statusCode } = await server.inject(request)

    expect(statusCode).toBe(200)
    expect(result).toEqual({})
  })

  test('should return 200 reponse with correct header and empty payload object', async () => {
    const url = 'http://localhost/test'

    const twilioHeader = getExpectedTwilioSignature('foobar', url, {})

    const request = {
      method: 'POST',
      url: '/test',
      payload: {},
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const { result, statusCode } = await server.inject(request)

    expect(statusCode).toBe(200)
    expect(result).toEqual({})
  })

  test('should return 401 "Unauthorizid" with invalid header and payload', async () => {
    const url = 'http://localhost/test'

    const twilioHeader = getExpectedTwilioSignature('foobar', url, {})

    const request = {
      method: 'POST',
      url: '/test',
      payload: {
        foo: 'bar',
      },
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {}
      },
      config: { auth: 'twilio' },
    })

    const {
      result: { error, message },
      statusCode,
    } = await server.inject(request)

    expect(statusCode).toBe(401)
    expect(error).toBe('Unauthorized')
    expect(message).toBe('Invalid "X-Twilio-Signature".')
  })

  test('should return 200 response with valid header and simple payload object', async () => {
    const url = 'http://localhost/test'

    const payload = {
      a: 'b',
    }

    const twilioHeader = getExpectedTwilioSignature('foobar', url, payload)

    const request = {
      method: 'POST',
      url: '/test',
      payload: {
        ...payload,
      },
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {
          foo: 'bar',
        }
      },
      config: { auth: 'twilio' },
    })

    const { result, statusCode } = await server.inject(request)

    expect(statusCode).toBe(200)
    expect(result).toEqual({ foo: 'bar' })
  })

  test('should return 200 response with valid header and complex payload', async () => {
    const payload = {
      // c: {},
      // a: null,
      _lower: 'q',
      d: 'foo',
      b: [1, 2, 3, 4],
      c: {
        bar: {
          foo: 'bar',
        },
      },
    }

    const url = 'http://localhost/test'

    const twilioHeader = getExpectedTwilioSignature('foobar', url, payload)

    const request = {
      method: 'POST',
      url: '/test',
      payload: {
        ...payload,
      },
      headers: { 'X-Twilio-Signature': twilioHeader },
    }

    server.route({
      method: 'POST',
      path: '/test',
      handler() {
        return {
          foo: 'bar',
        }
      },
      config: { auth: 'twilio' },
    })

    const { result, statusCode } = await server.inject(request)

    expect(statusCode).toBe(200)
    expect(result).toEqual({ foo: 'bar' })
  })
})
