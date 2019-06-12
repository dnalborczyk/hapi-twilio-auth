export default function scheme(server, options) {
  const {
    // if not set in plugin options, use env if provided
    authToken = process.env.TWILIO_AUTH_TOKEN,
    url,
  } = options

  if (!authToken) {
    throw new Error(
      'Twilio "authToken" is required for webhook request validation.',
    )
  }

  if (!url) {
    throw new Error('Twilio "url" is required for webhook request validation.')
  }

  return {
    async authenticate() {
      return true
    },
  }
}
