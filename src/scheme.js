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

  return {
    async authenticate() {
      return true
    },
  }
}
