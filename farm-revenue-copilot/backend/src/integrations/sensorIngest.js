'use strict';

/**
 * integrations/sensorIngest.js
 * Entry point for IoT / field-sensor data.
 * Normalises payloads from different sensor vendors into a common shape
 * and persists raw readings for the scoring pipeline to consume.
 */

/**
 * Common sensor reading shape (internal)
 * @typedef {{
 *   cropId: string,
 *   sensorId: string,
 *   timestamp: string,   // ISO-8601
 *   soilMoisturePct?: number,
 *   soilTemperatureC?: number,
 *   airTemperatureC?: number,
 *   humidityPct?: number,
 *   lightLux?: number,
 *   rawPayload: object
 * }} SensorReading
 */

/**
 * Ingest a sensor payload, normalise it, and store it.
 * @param {object} rawPayload  Vendor-specific JSON body
 * @param {string} vendorType  e.g. "generic" | "FieldSense" | "AgroStar"
 * @returns {Promise<SensorReading>}
 */
async function ingest(rawPayload, vendorType = 'generic') {
  const normalised = _normalise(rawPayload, vendorType);
  // TODO: persist to sensor_readings table / time-series store
  return normalised;
}

function _normalise(payload, vendorType) {
  // Generic passthrough — extend with vendor-specific transformers
  return {
    cropId:           payload.cropId || payload.crop_id,
    sensorId:         payload.sensorId || payload.sensor_id || 'unknown',
    timestamp:        payload.timestamp || new Date().toISOString(),
    soilMoisturePct:  payload.soilMoisture ?? payload.soil_moisture_pct,
    soilTemperatureC: payload.soilTemp ?? payload.soil_temperature_c,
    airTemperatureC:  payload.airTemp ?? payload.air_temperature_c,
    humidityPct:      payload.humidity ?? payload.humidity_pct,
    lightLux:         payload.light ?? payload.light_lux,
    rawPayload:       payload,
    vendorType,
  };
}

module.exports = { ingest };
