'use strict';

const { Router } = require('express');
const schemesService = require('../services/schemesService');

const router = Router();

/**
 * GET /api/schemes/match
 * Query params: state, cropType, landArea
 * Returns schemes the farmer is eligible for.
 */
router.get('/match', async (req, res, next) => {
  try {
    const schemes = await schemesService.match(req.query);
    res.json(schemes);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/schemes/:schemeId
 * Full detail for a single scheme.
 */
router.get('/:schemeId', async (req, res, next) => {
  try {
    const scheme = await schemesService.getById(req.params.schemeId);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
