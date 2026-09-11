/**
 * Mock data for AnnaVriddhi — realistic farmer data for preview
 */

export const farmer = {
  id: 'farmer-001',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  state: 'Maharashtra',
  district: 'Nashik',
  village: 'Dindori',
  totalArea: 5,
  language: 'Marathi',
  season: 'Kharif 2026',
};

export const crops = [
  {
    id: 'crop-wheat-001',
    name: 'Wheat (HD-3086)',
    variety: 'HD-3086',
    area: 3,
    stage: 'Vegetative',
    health: 'healthy',
    plantedDate: '2026-10-15',
    expectedHarvest: '2027-01-30',
    status: {
      moisture: 62,
      weather: 'sunny',
      pestRisk: 'low',
      diseaseRisk: 'low',
    },
  },
  {
    id: 'crop-cotton-001',
    name: 'Cotton (Bt)',
    variety: 'Bt Gossum',
    area: 2,
    stage: 'Boll formation',
    health: 'at-risk',
    plantedDate: '2026-09-20',
    expectedHarvest: '2027-01-15',
    status: {
      moisture: 48,
      weather: 'cloudy',
      pestRisk: 'medium',
      diseaseRisk: 'medium',
    },
  },
];

export const recommendations = [
  {
    id: 'rec-001',
    cropId: 'crop-wheat-001',
    type: 'irrigation',
    priority: 'high',
    title: 'Water your wheat today',
    body: 'Soil moisture will drop below safe levels in 48 hours. Irrigate now to protect yield.',
    whyNow: 'Your soil moisture is at 62%, and with the current weather pattern, it will reach critical levels by tomorrow evening.',
    revenue: { value: '₹400–500', description: 'Expected value protected this week' },
    actions: [
      { label: 'Irrigate field', detail: 'Standard 40mm depth recommended' },
      { label: 'Check water source', detail: 'Ensure adequate pressure in supply' },
      { label: 'Monitor post-irrigation', detail: 'Watch for runoff or drainage issues' },
    ],
    frequency: 'Repeat as needed based on soil conditions',
    createdAt: '2026-11-10',
    status: 'pending',
  },
  {
    id: 'rec-002',
    cropId: 'crop-wheat-001',
    type: 'monitoring',
    priority: 'medium',
    title: 'Check soil pH',
    body: 'Soil pH test recommended to ensure nutrient availability.',
    revenue: { value: '₹200–300', description: 'Prevent nutrient lockup' },
    createdAt: '2026-11-08',
    status: 'done',
  },
  {
    id: 'rec-003',
    cropId: 'crop-cotton-001',
    type: 'pest-management',
    priority: 'high',
    title: 'Monitor pest pressure',
    body: 'Bollworm populations increasing. Scout weekly and apply control if threshold exceeded.',
    revenue: { value: '₹600–800', description: 'Prevent 15–20% yield loss' },
    createdAt: '2026-11-09',
    status: 'pending',
  },
];

export const alerts = [
  {
    id: 'alert-001',
    cropId: 'crop-wheat-001',
    type: 'disease',
    severity: 'urgent',
    icon: '🦠',
    title: 'Powdery mildew detected',
    description: 'Your wheat crop is showing early signs of powdery mildew. Immediate treatment is recommended to prevent spread.',
    affectedArea: '0.5 acres (15% of field)',
    riskLevel: 'High if untreated — can reduce yield by 20–30%',
    actionDeadline: 'Within 24 hours',
    recommendedAction: 'Apply sulfur dust or neem oil spray. Ensure good air circulation by removing lower leaves.',
    estimatedCost: '₹800–1,200',
    createdAt: '2026-11-10T08:30:00Z',
  },
];

export const schemes = [
  {
    id: 'scheme-001',
    name: 'PM-KISAN',
    provider: 'Government of India',
    benefit: '₹6,000 per year in three installments',
    deadline: 'Ongoing',
    eligible: true,
    category: 'income-support',
    description: 'Direct Income Support Scheme for Marginal and Small Farmers',
    requirements: ['Land ownership proof', 'Aadhaar linked bank account'],
    nextPayment: 'Dec 2026',
  },
  {
    id: 'scheme-002',
    name: 'Fasal Bima Yojana',
    provider: 'Insurance',
    benefit: 'Crop insurance covering 72% of loss',
    deadline: '2026-12-31',
    eligible: true,
    category: 'insurance',
    description: 'Comprehensive crop insurance for farmers',
    requirements: ['Land record', 'Crop details', 'Insurance premium'],
    coverage: '72% of loss, up to ₹5 lakhs',
  },
  {
    id: 'scheme-003',
    name: 'KCC (Kisan Credit Card)',
    provider: 'NABARD',
    benefit: 'Up to ₹1.6 lakh credit at 4% interest',
    deadline: 'Ongoing',
    eligible: true,
    category: 'credit',
    description: 'Agricultural credit for seasonal needs',
    requirements: ['Land documents', 'Photo ID', 'Bank account'],
    tenure: '5–7 years',
  },
  {
    id: 'scheme-004',
    name: 'e-NAM (e-marketplace)',
    provider: 'Government',
    benefit: 'Direct market access, better prices',
    deadline: 'Ongoing',
    eligible: false,
    category: 'marketplace',
    description: 'National Agricultural Market platform',
    requirements: ['Registration', 'Produce grading'],
    note: 'Available in select states only',
  },
];

export const gradingHistory = [
  {
    id: 'grade-001',
    cropId: 'crop-wheat-001',
    date: '2026-11-10',
    crop: 'Wheat',
    grade: 'A1',
    price: '₹2,400–2,600',
    quantity: '2.5 quintals',
    notes: 'High moisture content, good quality',
  },
  {
    id: 'grade-002',
    cropId: 'crop-wheat-001',
    date: '2026-11-05',
    crop: 'Wheat',
    grade: 'A2',
    price: '₹2,200–2,400',
    quantity: '2.0 quintals',
    notes: 'Minor damage, overall good',
  },
  {
    id: 'grade-003',
    cropId: 'crop-cotton-001',
    date: '2026-10-28',
    crop: 'Cotton',
    grade: 'B1',
    price: '₹1,800–2,000',
    quantity: '1.8 bales',
    notes: 'Normal quality',
  },
];

export const seasonData = {
  crop: 'Wheat',
  year: 'Kharif 2026',
  startDate: '2026-10-15',
  endDate: '2027-01-30',
  stats: [
    { label: 'Recommendations followed', value: '11/14', color: 'sage' },
    { label: 'Average produce grade', value: 'A2', color: 'sage' },
    { label: 'Estimated yield impact', value: '+₹3,200', color: 'sage' },
    { label: 'Schemes applied', value: '2', color: 'amber' },
  ],
  recommendations: [
    { title: 'Water your wheat', action: 'followed', date: '2026-10-28', impact: 'Prevented soil stress' },
    { title: 'Monitor pest pressure', action: 'skipped', date: '2026-11-05', impact: 'Mild infestation noticed' },
    { title: 'Harvest in optimal window', action: 'followed', date: '2026-01-30', impact: 'Achieved 5.2 tons/acre' },
  ],
  insights: [
    {
      type: 'positive',
      title: 'Consistent monitoring helped',
      body: 'You followed 78% of recommendations this season, resulting in better yields and quality.',
    },
    {
      type: 'improve',
      title: 'Watch pest pressure earlier',
      body: 'Early detection of pests would have prevented the minor infestation in week 3.',
    },
  ],
};

export const timeline = [
  { date: '2026-10-15', label: 'Planted', stage: 'active' },
  { date: '2026-10-28', label: 'Germination', stage: 'active' },
  { date: '2026-11-05', label: 'Vegetative', stage: 'active' },
  { date: '2026-12-20', label: 'Flowering (est.)', stage: 'upcoming' },
  { date: '2027-01-30', label: 'Harvest (est.)', stage: 'upcoming' },
];

export const recentActivity = [
  { date: '2026-11-10', event: 'Recommendation: Water your wheat', status: 'pending' },
  { date: '2026-11-09', event: 'Alert: Cotton pest pressure', status: 'active' },
  { date: '2026-11-08', event: 'Grading recorded: A2', status: 'done' },
  { date: '2026-11-05', event: 'Entered vegetative stage', status: 'done' },
  { date: '2026-10-28', event: 'Field germination confirmed', status: 'done' },
];
