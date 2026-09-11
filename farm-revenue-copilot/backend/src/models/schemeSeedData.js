'use strict';

/**
 * Static scheme seed data.
 * Used by schemesService until a DB-backed schemes table is populated.
 * Mirror of the shape defined in shared/types/schemes.js
 */
const SCHEMES = [
  {
    id: 'scheme-pm-kisan',
    name: 'PM-KISAN',
    provider: 'Government of India',
    type: 'income_support',
    benefit: '₹6,000 per year direct transfer in 3 installments',
    eligibility: ['land owner', 'small/marginal farmer'],
    statesEligible: null,   // nationwide
    cropsEligible: null,    // all crops
    applyUrl: 'https://pmkisan.gov.in',
    deadline: null,
  },
  {
    id: 'scheme-fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    provider: 'Government of India',
    type: 'crop_insurance',
    benefit: 'Up to 100% premium subsidy for small/marginal farmers',
    eligibility: ['all farmers', 'notified crop in notified area'],
    statesEligible: null,
    cropsEligible: null,
    applyUrl: 'https://pmfby.gov.in',
    deadline: '2026-10-31',
  },
  {
    id: 'scheme-kcc',
    name: 'Kisan Credit Card',
    provider: 'NABARD / Banks',
    type: 'loan',
    benefit: 'Short-term credit up to ₹3 lakh at 4% p.a. with interest subvention',
    eligibility: ['farmers', 'sharecroppers', 'tenant farmers'],
    statesEligible: null,
    cropsEligible: null,
    applyUrl: 'https://www.nabard.org/content1.aspx?id=572',
    deadline: null,
  },
];

module.exports = SCHEMES;
