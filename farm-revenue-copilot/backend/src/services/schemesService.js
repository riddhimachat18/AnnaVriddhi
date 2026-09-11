'use strict';

/**
 * schemesService.js
 * Matches farmer profile against available government/bank schemes.
 */

// Static seed data — replace with DB query or external API
const SCHEMES = require('../models/schemeSeedData');

async function match({ state, cropType, landArea }) {
  // Basic eligibility filter — extend with real rules
  return SCHEMES.filter((s) => {
    if (s.statesEligible && !s.statesEligible.includes(state)) return false;
    if (s.cropsEligible && !s.cropsEligible.includes(cropType)) return false;
    return true;
  });
}

async function getById(schemeId) {
  return SCHEMES.find((s) => s.id === schemeId) || null;
}

module.exports = { match, getById };
