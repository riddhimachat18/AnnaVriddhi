import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, type Farmer, type UserSettings } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  farmer: Farmer | null;
  userSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, farmerData: Partial<Farmer>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await loadFarmerData(data.session.user.id);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadFarmerData(session.user.id);
      } else {
        setFarmer(null);
        setUserSettings(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadFarmerData = async (userId: string) => {
    try {
      // Fetch farmer profile
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (farmerError && farmerError.code !== 'PGRST116') {
        throw farmerError;
      }

      setFarmer(farmerData || null);

      // Fetch user settings
      if (farmerData) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('farmer_id', farmerData.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        setUserSettings(settingsData || null);
      }
    } catch (err) {
      console.error('Error loading farmer data:', err);
      setError('Failed to load farmer profile');
    }
  };

  const signUp = async (email: string, password: string, farmerData: Partial<Farmer>) => {
    try {
      setError(null);
      setLoading(true);

      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create farmer profile
      const { error: farmerError } = await supabase.from('farmers').insert({
        auth_user_id: authData.user.id,
        name: farmerData.name || '',
        phone: farmerData.phone,
        state: farmerData.state,
        district: farmerData.district,
        village: farmerData.village,
        total_area_acres: farmerData.total_area_acres,
        preferred_language: farmerData.preferred_language || 'English',
      });

      if (farmerError) throw farmerError;

      setUser(authData.user);
      await loadFarmerData(authData.user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signin');

      setSession(data.session);
      setUser(data.user);
      await loadFarmerData(data.user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setFarmer(null);
      setUserSettings(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    farmer,
    userSettings,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user && !!farmer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
