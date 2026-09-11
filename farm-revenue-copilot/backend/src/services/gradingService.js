'use strict';

/**
 * gradingService.js
 * Orchestrates crop grading: calls ML model / rule engine,
 * persists result, returns structured grade.
 */

// TODO: replace stub with real DB + ML integration
async function grade(payload) {
  // payload: { cropId, imageUrl?, notes? }
  return {
    cropId:  payload.cropId,
    grade:   'A2',
    score:   82,
    gradedAt: new Date().toISOString(),
    notes:   'Stub result — replace with real model output',
  };
}

async function getLatest(cropId) {
  // TODO: query DB for most recent grading record
  return { cropId, grade: 'A2', score: 82, gradedAt: new Date().toISOString() };
}

async function getHistory(cropId) {
  // TODO: query DB for all grading records
  return [];
}

module.exports = { grade, getLatest, getHistory };
