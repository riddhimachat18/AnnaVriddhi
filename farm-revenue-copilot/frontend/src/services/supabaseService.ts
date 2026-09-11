import { supabase } from '../lib/supabase';
import type {
  Farmer,
  Plot,
  Crop,
  CropHealthDaily,
  Recommendation,
  Alert,
  ProduceGrade,
  GovernmentScheme,
  FarmerSchemeApplication,
  Season,
  SeasonReview,
  Message,
} from '../lib/supabase';

/**
 * Supabase Data Layer Service
 * Handles all CRUD operations and queries for the app
 */

// ============================================================================
// PLOTS / FIELDS
// ============================================================================

export async function getPlots(farmerId: string): Promise<Plot[]> {
  const { data, error } = await supabase
    .from('plots')
    .select('*')
    .eq('farmer_id', farmerId);

  if (error) throw error;
  return data || [];
}

export async function createPlot(plot: Partial<Plot>): Promise<Plot> {
  const { data, error } = await supabase
    .from('plots')
    .insert(plot)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CROPS
// ============================================================================

export async function getCrops(farmerId: string): Promise<Crop[]> {
  const { data, error } = await supabase
    .from('crops')
    .select(`
      *,
      plot:plot_id (farmer_id)
    `)
    .eq('plot.farmer_id', farmerId);

  if (error) throw error;
  return data || [];
}

export async function getCropsByPlot(plotId: string): Promise<Crop[]> {
  const { data, error } = await supabase
    .from('crops')
    .select('*')
    .eq('plot_id', plotId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCropWithHealth(cropId: string): Promise<(Crop & { health?: CropHealthDaily | null }) | null> {
  const { data: crop, error: cropError } = await supabase
    .from('crops')
    .select('*')
    .eq('id', cropId)
    .single();

  if (cropError) throw cropError;

  // Get today's health data
  const { data: health } = await supabase
    .from('crop_health_daily')
    .select('*')
    .eq('crop_id', cropId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  return { ...crop, health } || null;
}

export async function createCrop(crop: Partial<Crop>): Promise<Crop> {
  const { data, error } = await supabase
    .from('crops')
    .insert(crop)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCrop(cropId: string, updates: Partial<Crop>): Promise<Crop> {
  const { data, error } = await supabase
    .from('crops')
    .update(updates)
    .eq('id', cropId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CROP HEALTH DATA
// ============================================================================

export async function getCropHealthHistory(cropId: string, days: number = 7): Promise<CropHealthDaily[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const { data, error } = await supabase
    .from('crop_health_daily')
    .select('*')
    .eq('crop_id', cropId)
    .gte('date', fromDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getCropHealthToday(cropId: string): Promise<CropHealthDaily | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('crop_health_daily')
    .select('*')
    .eq('crop_id', cropId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function createCropHealthDaily(health: Partial<CropHealthDaily>): Promise<CropHealthDaily> {
  const { data, error } = await supabase
    .from('crop_health_daily')
    .insert(health)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

export async function getRecommendations(farmerId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRecommendationsByCrop(cropId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('crop_id', cropId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getTopRecommendations(farmerId: string, limit: number = 3): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('farmer_id', farmerId)
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function createRecommendation(rec: Partial<Recommendation>): Promise<Recommendation> {
  const { data, error } = await supabase
    .from('recommendations')
    .insert(rec)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRecommendation(recId: string, updates: Partial<Recommendation>): Promise<Recommendation> {
  const { data, error } = await supabase
    .from('recommendations')
    .update(updates)
    .eq('id', recId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// ALERTS
// ============================================================================

export async function getAlerts(farmerId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getActiveAlerts(farmerId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('farmer_id', farmerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAlert(alert: Partial<Alert>): Promise<Alert> {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAlert(alertId: string, updates: Partial<Alert>): Promise<Alert> {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// PRODUCE GRADES (GRADING HISTORY)
// ============================================================================

export async function getProduceGrades(farmerId: string): Promise<ProduceGrade[]> {
  const { data, error } = await supabase
    .from('produce_grades')
    .select(`
      *,
      crop:crop_id (id, crop_name, plot_id)
    `)
    .order('graded_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProduceGradesByCrop(cropId: string): Promise<ProduceGrade[]> {
  const { data, error } = await supabase
    .from('produce_grades')
    .select('*')
    .eq('crop_id', cropId)
    .order('graded_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduceGrade(grade: Partial<ProduceGrade>): Promise<ProduceGrade> {
  const { data, error } = await supabase
    .from('produce_grades')
    .insert(grade)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// GOVERNMENT SCHEMES
// ============================================================================

export async function getGovernmentSchemes(): Promise<GovernmentScheme[]> {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSchemesByState(state: string): Promise<GovernmentScheme[]> {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .eq('is_active', true)
    .or(`state_specific.ilike.%${state}%,state_specific.eq.All States`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================================
// FARMER SCHEME APPLICATIONS
// ============================================================================

export async function getFarmerSchemeApplications(farmerId: string): Promise<FarmerSchemeApplication[]> {
  const { data, error } = await supabase
    .from('farmer_scheme_applications')
    .select(`
      *,
      scheme:scheme_id (*)
    `)
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSchemeApplication(app: Partial<FarmerSchemeApplication>): Promise<FarmerSchemeApplication> {
  const { data, error } = await supabase
    .from('farmer_scheme_applications')
    .insert(app)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSchemeApplication(appId: string, updates: Partial<FarmerSchemeApplication>): Promise<FarmerSchemeApplication> {
  const { data, error } = await supabase
    .from('farmer_scheme_applications')
    .update(updates)
    .eq('id', appId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SEASONS
// ============================================================================

export async function getSeasons(farmerId: string): Promise<Season[]> {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getActiveSeason(farmerId: string): Promise<Season | null> {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('farmer_id', farmerId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function createSeason(season: Partial<Season>): Promise<Season> {
  const { data, error } = await supabase
    .from('seasons')
    .insert(season)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSeason(seasonId: string, updates: Partial<Season>): Promise<Season> {
  const { data, error } = await supabase
    .from('seasons')
    .update(updates)
    .eq('id', seasonId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SEASON REVIEWS
// ============================================================================

export async function getSeasonReviews(seasonId: string): Promise<SeasonReview[]> {
  const { data, error } = await supabase
    .from('season_reviews')
    .select('*')
    .eq('season_id', seasonId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSeasonReview(review: Partial<SeasonReview>): Promise<SeasonReview> {
  const { data, error } = await supabase
    .from('season_reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MESSAGES
// ============================================================================

export async function getMessages(farmerId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getUnreadMessages(farmerId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('farmer_id', farmerId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMessage(msg: Partial<Message>): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(msg)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessageAsRead(messageId: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
