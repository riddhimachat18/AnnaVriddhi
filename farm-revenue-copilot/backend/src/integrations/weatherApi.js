'use strict';

/**
 * integrations/weatherApi.js
 * Wrapper around OpenWeatherMap (or compatible) API.
 * All other modules import from here — never call weather API directly.
 */

const https = require('https');

const BASE_URL = process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const API_KEY  = process.env.WEATHER_API_KEY || '';

/**
 * Fetch current weather for a lat/lon location.
 * @param {{ lat: number, lon: number }} coords
 * @returns {Promise<object>} OpenWeatherMap current-weather response
 */
async function getCurrentWeather({ lat, lon }) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return _get(url);
}

/**
 * Fetch 5-day / 3-hour forecast for a lat/lon location.
 * @param {{ lat: number, lon: number }} coords
 */
async function getForecast({ lat, lon }) {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return _get(url);
}

function _get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) {
            reject(new Error(`Weather API error ${res.statusCode}: ${parsed.message}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

module.exports = { getCurrentWeather, getForecast };
