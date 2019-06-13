import { URL } from 'url'
import boom from '@hapi/boom'
import twilio from 'twilio'

const { validateRequest } = twilio
const { badRequest, unauthorized } = boom

// in hapi, all headers are lower cased
const TWILIO_SIGNATURE_HEADER = 'x-twilio-signature'

export default function scheme(server, options) {
  const {
    // if not set in plugin options, use env if provided
    authToken = process.env.TWILIO_AUTH_TOKEN,
    baseUrl,
  } = options

  if (!authToken) {
    throw new Error(
      'Twilio "authToken" is required for webhook request authentication.',
    )
  }

  if (!baseUrl) {
    throw new Error(
      'Twilio "baseUrl" is required for webhook request authentication.',
    )
  }

  // check if we have a valid URL
  try {
    new URL(baseUrl) // eslint-disable-line no-new
  } catch (e) {
    throw new Error('Twilio "baseUrl" is not a valid URL.')
  }

  return {
    // lifecycle method called for each incoming request configured the
    // authentication scheme
    authenticate(request, h) {
      const {
        _isPayloadPending,
        headers: { [TWILIO_SIGNATURE_HEADER]: signature },
        path,
      } = request

      if (signature == null) {
        throw badRequest(
          'Missing header "X-Twilio-Signature" for Twilio authentication.',
        )
      }

      // has payload, then delegate verification in payload()
      // eslint-disable-next-line no-underscore-dangle
      if (_isPayloadPending) {
        // returning unauthenticated delegates to payload auth
        return h.unauthenticated()
      }

      const url = new URL(path, baseUrl).toString()

      const isValid = validateRequest(authToken, signature, url, {})

      if (!isValid) {
        throw unauthorized('Invalid "X-Twilio-Signature".')
      }

      // when authentication is successful, you must call and return
      return h.authenticated({ credentials: {} })
    },

    // lifecycle method to authenticate the request payload
    payload(request, h) {
      const {
        headers: { [TWILIO_SIGNATURE_HEADER]: signature },
        path,
        payload,
      } = request

      const url = new URL(path, baseUrl).toString()

      const isValid = validateRequest(authToken, signature, url, payload || {})

      if (!isValid) {
        throw unauthorized('Invalid "X-Twilio-Signature".')
      }

      return h.continue
    },

    options: {
      // if true, requires payload validation as part of the scheme and forbids
      // routes from disabling payload auth validation
      payload: true,
    },
  }
}
