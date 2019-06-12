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
    async authenticate() {
      return true
    },
  }
}
