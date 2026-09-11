'use strict';

const { Router } = require('express');
const recommendationService = require('../services/recommendationService');

const router = Router();

/**
 * GET /api/recommendations/:cropId
 * All pending & recent recommendations for a crop.
 */
router.get('/:cropId', async (req, res, next) => {
  try {
    const recs = await recommendationService.getForCrop(req.params.cropId);
    res.json(recs);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/recommendations/:recommendationId/acknowledge
 * Log farmer acknowledgement / action taken.
 * Body: { action, notes? }
 */
router.post('/:recommendationId/acknowledge', async (req, res, next) => {
  try {
    const updated = await recommendationService.acknowledge(
      req.params.recommendationId,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
