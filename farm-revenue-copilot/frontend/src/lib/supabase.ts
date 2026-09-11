import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — copy .env.example to .env.local and fill in your values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = any; // TODO: Generate types with supabase-js CLI

// Type definitions for domain entities
export interface Farmer {
  id: string;
  auth_user_id: string;
  name: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  total_area_acres?: number;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface Plot {
  id: string;
  farmer_id: string;
  name: string;
  area_acres?: number;
  soil_type?: string;
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  plot_id: string;
  crop_name: string;
  variety?: string;
  planted_date?: string;
  expected_harvest_date?: string;
  current_stage?: string;
  health_status: string;
  created_at: string;
  updated_at: string;
}

export interface CropHealthDaily {
  id: string;
  crop_id: string;
  date: string;
  health_score?: number;
  moisture_pct?: number;
  disease_risk_pct?: number;
  nitrogen_level?: number;
  canopy_cover_pct?: number;
  organic_carbon?: number;
  soil_ph?: number;
  soil_ec?: number;
  canopy_temperature?: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  crop_id: string;
  farmer_id: string;
  type: string;
  priority: string;
  title: string;
  body?: string;
  why_now?: string;
  predicted_revenue_impact?: number;
  actions?: any[];
  frequency?: string;
  deadline_date?: string;
  status: string;
  action_taken_date?: string;
  actual_revenue_impact?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  crop_id?: string;
  farmer_id: string;
  alert_type: string;
  severity: string;
  title: string;
  description?: string;
  affected_area?: string;
  risk_level?: string;
  action_deadline?: string;
  recommended_action?: string;
  estimated_cost?: number;
  status: string;
  created_at: string;
  resolved_at?: string;
}

export interface ProduceGrade {
  id: string;
  crop_id: string;
  batch_number?: string;
  grade: string;
  quality_score?: number;
  grain_size_uniformity_score?: number;
  color_ripeness_score?: number;
  surface_quality_score?: number;
  moisture_estimate?: number;
  quantity?: number;
  market_price_per_unit?: number;
  batch_revenue?: number;
  graded_date: string;
  graded_by?: string;
  image_url?: string;
  notes?: string;
  created_at: string;
}

export interface GovernmentScheme {
  id: string;
  scheme_name: string;
  provider?: string;
  category: string;
  description?: string;
  benefit_description?: string;
  benefit_amount?: number;
  eligibility_criteria?: string[];
  required_documents?: any[];
  application_deadline?: string;
  state_specific?: string;
  is_active: boolean;
  created_at: string;
}

export interface FarmerSchemeApplication {
  id: string;
  farmer_id: string;
  scheme_id: string;
  application_status: string;
  estimated_benefit?: number;
  actual_benefit?: number;
  documents_submitted?: any[];
  application_date?: string;
  approval_date?: string;
  disbursement_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  farmer_id: string;
  season_name: string;
  start_date?: string;
  end_date?: string;
  crop_id?: string;
  plot_id?: string;
  total_revenue_added: number;
  recommendations_followed: number;
  recommendations_skipped: number;
  recommendations_partial: number;
  average_produce_grade?: string;
  estimated_yield_impact?: number;
  schemes_applied: number;
  is_active: boolean;
  created_at: string;
  ended_at?: string;
}

export interface SeasonReview {
  id: string;
  season_id: string;
  review_type: string;
  title: string;
  body?: string;
  insight_date?: string;
  revenue_impact?: number;
  created_at: string;
}

export interface Message {
  id: string;
  farmer_id: string;
  message_type: string;
  title: string;
  body?: string;
  channel: string;
  is_read: boolean;
  related_crop_id?: string;
  related_recommendation_id?: string;
  created_at: string;
  read_at?: string;
}

export interface UserSettings {
  id: string;
  farmer_id: string;
  preferred_language: string;
  notification_enabled: boolean;
  notification_channel: string;
  daily_digest_enabled: boolean;
  alert_threshold_settings?: any;
  theme: string;
  created_at: string;
  updated_at: string;
}
