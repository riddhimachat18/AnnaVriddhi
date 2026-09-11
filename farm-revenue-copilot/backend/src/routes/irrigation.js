'use strict';

const { Router } = require('express');
const irrigationService = require('../services/irrigationService');

const router = Router();

/**
 * GET /api/irrigation/:cropId/schedule
 * Returns the current irrigation schedule and next recommended action.
 */
router.get('/:cropId/schedule', async (req, res, next) => {
  try {
    const schedule = await irrigationService.getSchedule(req.params.cropId);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/irrigation/:cropId/log
 * Log a completed irrigation event.
 * Body: { date, amountMm, method }
 */
router.post('/:cropId/log', async (req, res, next) => {
  try {
    const event = await irrigationService.logEvent(req.params.cropId, req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
