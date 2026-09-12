import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as supabaseService from '../services/supabaseService';
import { getDemoData } from '../services/demoDataService';
import type {
  Crop,
  CropHealthDaily,
  Recommendation,
  Alert,
  Plot,
  Season,
  Message,
} from '../lib/supabase';

interface DataContextType {
  // Data
  plots: Plot[];
  crops: Crop[];
  currentCrop: Crop | null;
  cropHealth: CropHealthDaily | null;
  cropHealthHistory: CropHealthDaily[];
  recommendations: Recommendation[];
  topRecommendations: Recommendation[];
  alerts: Alert[];
  activeAlerts: Alert[];
  activeSeason: Season | null;
  unreadMessages: Message[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentCrop: (crop: Crop | null) => void;
  refreshCropHealth: () => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshAll: () => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { farmer, isAuthenticated } = useAuth();

  // Data state
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [currentCrop, setCurrentCrop] = useState<Crop | null>(null);
  const [cropHealth, setCropHealth] = useState<CropHealthDaily | null>(null);
  const [cropHealthHistory, setCropHealthHistory] = useState<CropHealthDaily[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [topRecommendations, setTopRecommendations] = useState<Recommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data when user authenticates
  useEffect(() => {
    if (isAuthenticated && farmer) {
      refreshAll();
    }
  }, [isAuthenticated, farmer?.id]);

  // Refresh crop health and history when current crop changes
  useEffect(() => {
    if (currentCrop) {
      refreshCropHealth();
    }
  }, [currentCrop?.id]);

  const refreshCropHealth = useCallback(async () => {
    if (!currentCrop) return;

    try {
      const [health, history] = await Promise.all([
        supabaseService.getCropHealthToday(currentCrop.id),
        supabaseService.getCropHealthHistory(currentCrop.id, 7),
      ]);

      setCropHealth(health);
      setCropHealthHistory(history);
    } catch (err) {
      console.error('Error loading crop health:', err);
      setError('Failed to load crop health data');
    }
  }, [currentCrop]);

  const refreshRecommendations = useCallback(async () => {
    if (!farmer) return;

    try {
      const [all, top] = await Promise.all([
        supabaseService.getRecommendations(farmer.id),
        supabaseService.getTopRecommendations(farmer.id, 3),
      ]);

      setRecommendations(all);
      setTopRecommendations(top);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    }
  }, [farmer]);

  const refreshAlerts = useCallback(async () => {
    if (!farmer) return;

    try {
      const [all, active] = await Promise.all([
        supabaseService.getAlerts(farmer.id),
        supabaseService.getActiveAlerts(farmer.id),
      ]);

      setAlerts(all);
      setActiveAlerts(active);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError('Failed to load alerts');
    }
  }, [farmer]);

  const refreshMessages = useCallback(async () => {
    if (!farmer) return;

    try {
      const messages = await supabaseService.getUnreadMessages(farmer.id);
      setUnreadMessages(messages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  }, [farmer]);

  const refreshAll = useCallback(async () => {
    if (!farmer) return;

    setLoading(true);
    setError(null);

    try {
      // Check if this is demo account
      const isDemoAccount = localStorage.getItem('is_demo_account') === 'true';
      
      if (isDemoAccount) {
        console.log('Loading demo data for demo account');
        const demoData = getDemoData();
        
        // Convert demo data to app format
        setPlots([]);
        setCrops(demoData.crops as any);
        setActiveSeason(null);
        
        // Set current crop to first available
        if (demoData.crops.length > 0 && !currentCrop) {
          setCurrentCrop(demoData.crops[0] as any);
        }
        
        // Set demo recommendations and alerts
        setRecommendations(demoData.recommendations as any);
        setTopRecommendations(demoData.recommendations.slice(0, 3) as any);
        setAlerts(demoData.alerts as any);
        setActiveAlerts(demoData.alerts as any);
        setUnreadMessages([]);
        
        setLoading(false);
        return;
      }

      // Real user - load from database
      const plotsPromise = supabaseService.getPlots(farmer.id).catch(err => {
        console.error('Error loading plots:', err);
        return [];
      });
      
      const cropsPromise = supabaseService.getCrops(farmer.id).catch(err => {
        console.error('Error loading crops:', err);
        return [];
      });
      
      const seasonPromise = supabaseService.getActiveSeason(farmer.id).catch(err => {
        console.error('Error loading season:', err);
        return null;
      });

      const [plotsData, cropsData, season] = await Promise.all([
        plotsPromise,
        cropsPromise,
        seasonPromise,
      ]);

      setPlots(plotsData);
      setCrops(cropsData);
      setActiveSeason(season);

      // Set current crop to first available crop
      if (cropsData.length > 0 && !currentCrop) {
        setCurrentCrop(cropsData[0]);
      }

      // Load recommendations, alerts, and messages - non-blocking
      Promise.all([
        refreshRecommendations(),
        refreshAlerts(),
        refreshMessages(),
      ]).catch(err => {
        console.error('Error loading additional data:', err);
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      // Don't set error - allow app to continue with empty data
    } finally {
      setLoading(false);
    }
  }, [farmer, currentCrop, refreshRecommendations, refreshAlerts, refreshMessages]);

  const handleMarkMessageAsRead = useCallback(async (messageId: string) => {
    try {
      await supabaseService.markMessageAsRead(messageId);
      setUnreadMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark message as read');
    }
  }, []);

  const value: DataContextType = {
    plots,
    crops,
    currentCrop,
    cropHealth,
    cropHealthHistory,
    recommendations,
    topRecommendations,
    alerts,
    activeAlerts,
    activeSeason,
    unreadMessages,
    loading,
    error,
    setCurrentCrop,
    refreshCropHealth,
    refreshRecommendations,
    refreshAlerts,
    refreshAll,
    markMessageAsRead: handleMarkMessageAsRead,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
