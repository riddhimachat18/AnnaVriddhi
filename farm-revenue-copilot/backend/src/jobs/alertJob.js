'use strict';

/**
 * jobs/alertJob.js
 * Scheduled job — scans pending high-priority recommendations and
 * dispatches SMS / WhatsApp alerts to the relevant farmers.
 *
 * Typically runs after cropStateJob (or triggered by it).
 */

const { sendSms } = require('../integrations/smsWhatsapp');
// const db = require('../db'); // TODO: wire up DB client

async function run() {
  console.log('[alertJob] Scanning for unsent high-priority alerts…');

  // TODO: query recommendation_events WHERE priority = 'high' AND status = 'pending' AND alerted_at IS NULL
  const pendingAlerts = [];

  for (const alert of pendingAlerts) {
    try {
      await sendSms({
        to:   alert.farmerPhone,
        body: `[FarmCopilot] ${alert.title}: ${alert.body}`,
      });
      // TODO: mark alerted_at in DB
      console.log(`[alertJob] Sent alert ${alert.id} to ${alert.farmerPhone}`);
    } catch (err) {
      console.error(`[alertJob] Failed to send alert ${alert.id}:`, err.message);
    }
  }

  console.log(`[alertJob] Done. Sent ${pendingAlerts.length} alerts.`);
}

module.exports = { run };
