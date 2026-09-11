'use strict';

/**
 * revenueService.js
 * Core revenue calculation logic.
 * Combines expected yield, market price, input costs, and scheme benefits.
 */

/**
 * Calculate projected net revenue for a crop.
 *
 * @param {{
 *   expectedYieldKg: number,
 *   marketPricePerKg: number,
 *   inputCostTotal: number,
 *   schemeBenefitTotal?: number
 * }} params
 * @returns {{ grossRevenue: number, netRevenue: number, profitMarginPct: number }}
 */
function calculateProjectedRevenue({ expectedYieldKg, marketPricePerKg, inputCostTotal, schemeBenefitTotal = 0 }) {
  const grossRevenue = expectedYieldKg * marketPricePerKg;
  const netRevenue   = grossRevenue - inputCostTotal + schemeBenefitTotal;
  const profitMarginPct = grossRevenue > 0
    ? Math.round((netRevenue / grossRevenue) * 100 * 10) / 10
    : 0;

  return { grossRevenue, netRevenue, profitMarginPct };
}

/**
 * Score crop state on a 0–100 scale based on multiple field signals.
 * Higher = better revenue potential.
 *
 * @param {{ soilMoisturePct: number, leafColorScore: number, pestPressureScore: number, growthStagePct: number }} signals
 * @returns {number}
 */
function scoreCropState({ soilMoisturePct, leafColorScore, pestPressureScore, growthStagePct }) {
  // Weighted average — weights sum to 1
  const score =
    soilMoisturePct   * 0.30 +
    leafColorScore    * 0.30 +
    pestPressureScore * 0.20 +
    growthStagePct    * 0.20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

module.exports = { calculateProjectedRevenue, scoreCropState };
