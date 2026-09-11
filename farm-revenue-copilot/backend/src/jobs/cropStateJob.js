'use strict';

/**
 * jobs/cropStateJob.js
 * Scheduled job — recomputes crop-state scores for all active crops
 * and triggers alert generation if thresholds are breached.
 *
 * Run this on a cron (e.g. every 6 hours) via a job runner such as
 * node-cron, BullMQ, or an external scheduler.
 *
 * Example standalone execution:
 *   node -e "require('./src/jobs/cropStateJob').run()"
 */

const { scoreCropState } = require('../services/revenueService');
const recommendationService = require('../services/recommendationService');
// const db = require('../db'); // TODO: wire up DB client

/**
 * Main entry point — called by the scheduler.
 */
async function run() {
  console.log('[cropStateJob] Starting crop-state computation…');

  // TODO: fetch all active crop IDs from DB
  const activeCropIds = [];

  for (const cropId of activeCropIds) {
    try {
      await processOneCrop(cropId);
    } catch (err) {
      console.error(`[cropStateJob] Error processing crop ${cropId}:`, err.message);
    }
  }

  console.log(`[cropStateJob] Done. Processed ${activeCropIds.length} crops.`);
}

async function processOneCrop(cropId) {
  // 1. Fetch latest sensor readings for this crop
  // const readings = await db.query('SELECT … FROM sensor_readings WHERE crop_id = $1 …', [cropId]);

  // 2. Score the crop
  const score = scoreCropState({
    soilMoisturePct:    70, // placeholder
    leafColorScore:     80,
    pestPressureScore:  85,
    growthStagePct:     60,
  });

  // 3. Persist snapshot
  // await db.query('INSERT INTO crop_state_snapshots …', [cropId, score, …]);

  // 4. Generate recommendations if score is below threshold
  if (score < 60) {
    await recommendationService.generate(cropId);
  }

  console.log(`[cropStateJob] Crop ${cropId} scored ${score}`);
}

module.exports = { run };
