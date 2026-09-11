'use strict';

/**
 * revenueService.js
 * Core revenue calculation logic.
 * Combines expected yield, market price, input costs, and scheme benefits.
 */

const db = require('../models/db');

// ── Hardcoded cost estimates per intervention type (in INR) ──
const INTERVENTION_COSTS = {
  irrigation:  500,   // Per application
  fertilizer:  1200,  // Per application
  pesticide:   800,   // Per application
  cover:       2000,  // Protective covers/nets
  do_nothing:  0,     // No cost
};

// ── Hardcoded yield impact percentages per intervention ──
const YIELD_IMPACT = {
  irrigation:  0.08,   // +8% yield if irrigated when needed
  fertilizer:  0.12,   // +12% yield with fertilizer
  pesticide:   0.15,   // +15% yield (prevents loss from pests)
  cover:       0.10,   // +10% yield (prevents storm damage)
  do_nothing:  0.00,   // No change
};

// ── Average market prices per crop type (INR per quintal) ──
// Source: Agmarknet historical averages
const MARKET_PRICES = {
  wheat:      2000,
  rice:       1800,
  paddy:      1800,
  cotton:     5500,
  sugarcane:  280,  // Per quintal (lower per unit but high volume)
  maize:      1700,
  corn:       1700,
  soybean:    3800,
  chickpea:   5000,
  chana:      5000,
  groundnut:  5200,
  peanut:     5200,
  mustard:    4500,
  sunflower:  4200,
  default:    2500, // Fallback
};

/**
 * Get market price for a crop type.
 * @param {string} cropType
 * @returns {number} - Price in INR per quintal
 */
function getMarketPrice(cropType) {
  if (!cropType) return MARKET_PRICES.default;
  const normalized = cropType.toLowerCase().trim().replace(/\s+/g, '-');
  return MARKET_PRICES[normalized] || MARKET_PRICES.default;
}

/**
 * Estimate expected yield for a crop based on area and crop type.
 * @param {number} areaAc - Area in acres
 * @param {string} cropType
 * @returns {number} - Expected yield in quintals
 */
function estimateBaseYield(areaAc, cropType) {
  // Average yield per acre in quintals (conservative estimates)
  const yieldPerAcre = {
    wheat:      20,
    rice:       25,
    cotton:     12,
    sugarcane:  300,
    maize:      22,
    soybean:    15,
    default:    18,
  };
  
  const normalized = cropType?.toLowerCase().trim().replace(/\s+/g, '-');
  const yieldRate = yieldPerAcre[normalized] || yieldPerAcre.default;
  
  return areaAc * yieldRate;
}

/**
 * Estimate revenue impact of taking a recommended action.
 * Formula: predicted_yield_delta × price_per_unit - cost_of_action
 * 
 * @param {string} cropId - UUID of the crop
 * @param {string} recommendationType - Type of recommendation
 * @returns {Promise<number>} - Predicted revenue impact in INR
 */
async function estimateImpact(cropId, recommendationType) {
  try {
    // Fetch crop details
    const cropResult = await db.query(
      'SELECT crop_type, area_ac FROM crops WHERE id = $1',
      [cropId]
    );
    
    if (cropResult.rows.length === 0) {
      console.warn(`[revenueService] Crop ${cropId} not found`);
      return 0;
    }
    
    const { crop_type, area_ac } = cropResult.rows[0];
    
    // Get base yield estimate
    const baseYield = estimateBaseYield(area_ac || 1, crop_type);
    
    // Get yield impact percentage for this intervention
    const yieldImpactPct = YIELD_IMPACT[recommendationType] || 0;
    
    // Calculate yield delta (in quintals)
    const yieldDelta = baseYield * yieldImpactPct;
    
    // Get market price
    const pricePerQuintal = getMarketPrice(crop_type);
    
    // Calculate revenue gain
    const revenueGain = yieldDelta * pricePerQuintal;
    
    // Get intervention cost
    const cost = INTERVENTION_COSTS[recommendationType] || 0;
    
    // Net impact
    const netImpact = revenueGain - cost;
    
    console.log(
      `[revenueService] Impact for ${crop_type} (${area_ac} ac): ` +
      `+${yieldDelta.toFixed(2)}q × ₹${pricePerQuintal} - ₹${cost} = ₹${netImpact.toFixed(2)}`
    );
    
    return parseFloat(netImpact.toFixed(2));
    
  } catch (err) {
    console.error('[revenueService] Error estimating impact:', err.message);
    return 0;
  }
}

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

module.exports = { 
  calculateProjectedRevenue, 
  scoreCropState,
  estimateImpact,
  getMarketPrice,
  estimateBaseYield,
  INTERVENTION_COSTS,
  YIELD_IMPACT,
};
