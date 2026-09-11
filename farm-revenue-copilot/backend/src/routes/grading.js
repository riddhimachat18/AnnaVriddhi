'use strict';

const { Router } = require('express');
const gradingService = require('../services/gradingService');

const router = Router();

/**
 * POST /api/grading
 * Submit a new grading observation (multipart: image + metadata).
 */
router.post('/', async (req, res, next) => {
  try {
    // TODO: wire up multer for image upload
    const result = await gradingService.grade(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grading/:cropId/latest
 * Latest grading result for a crop.
 */
router.get('/:cropId/latest', async (req, res, next) => {
  try {
    const result = await gradingService.getLatest(req.params.cropId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grading/:cropId/history
 * Full grading history for a crop.
 */
router.get('/:cropId/history', async (req, res, next) => {
  try {
    const history = await gradingService.getHistory(req.params.cropId);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
