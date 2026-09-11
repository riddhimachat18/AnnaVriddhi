'use strict';

/**
 * recommendationService.js
 * Generates and stores crop recommendations.
 * Sources: crop-state score, weather, soil, grading output.
 */

async function getForCrop(cropId) {
  // TODO: query recommendation_events table
  return [];
}

async function acknowledge(recommendationId, { action, notes }) {
  // TODO: update recommendation_events record
  return { recommendationId, action, notes, acknowledgedAt: new Date().toISOString() };
}

/**
 * Generate a new batch of recommendations for a crop and persist them.
 * Called by the scheduled job.
 * @param {string} cropId
 */
async function generate(cropId) {
  // TODO: run scoring logic, call revenueService, build recommendation objects
  return [];
}

module.exports = { getForCrop, acknowledge, generate };
