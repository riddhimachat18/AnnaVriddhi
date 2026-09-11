'use strict';

/**
 * integrations/smsWhatsapp.js
 * Sends SMS and WhatsApp alerts via Twilio.
 * Wrap all messaging behind this module so the provider can be swapped.
 */

// Lazy-load Twilio only if credentials are present
function _getClient() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN)');
  }
  // eslint-disable-next-line global-require
  return require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

/**
 * Send a plain SMS.
 * @param {{ to: string, body: string }} params  `to` should be E.164 format
 */
async function sendSms({ to, body }) {
  const client = _getClient();
  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body,
  });
}

/**
 * Send a WhatsApp message via Twilio WhatsApp sandbox / approved number.
 * @param {{ to: string, body: string }} params  `to` = whatsapp:+91XXXXXXXXXX
 */
async function sendWhatsApp({ to, body }) {
  const client = _getClient();
  const from = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
  const toWA  = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  return client.messages.create({ from, to: toWA, body });
}

module.exports = { sendSms, sendWhatsApp };
