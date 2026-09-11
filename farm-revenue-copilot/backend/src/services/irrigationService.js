'use strict';

/**
 * irrigationService.js
 * Computes irrigation schedules and logs irrigation events.
 * Inputs: soil-moisture sensor data + weather forecast.
 */

async function getSchedule(cropId) {
  // TODO: pull sensor readings, call weather integration, compute schedule
  return {
    cropId,
    nextIrrigationDate: null,
    recommendedAmountMm: null,
    note: 'Stub — sensor + weather integration pending',
  };
}

async function logEvent(cropId, { date, amountMm, method }) {
  // TODO: persist to DB
  return { cropId, date, amountMm, method, loggedAt: new Date().toISOString() };
}

module.exports = { getSchedule, logEvent };
