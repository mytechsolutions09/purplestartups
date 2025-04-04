import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleData, setRoleData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserRole = async (userId: string) => {
    try {
      console.log("Checking role for user:", userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Error checking role:", error);
        return false;
      }
      
      console.log("Role data from DB:", data);
      const isUserAdmin = data?.role === 'admin';
      console.log("Is user admin:", isUserAdmin);
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error("Error in checkUserRole:", error);
      return false;
    }
  };

  const refreshUserRole = async () => {
    if (!user) return;
    
    try {
      const isUserAdmin = await checkUserRole(user.id);
      setIsAdmin(isUserAdmin);
      console.log("Updated admin status:", isUserAdmin);
    } catch (error) {
      console.error("Error refreshing role:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          checkUserRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('AuthContext - Checking role data:', roleData);
    console.log('Current pathname:', window.location.pathname);
    
    if (roleData?.role === 'admin') {
      console.log('Setting user as admin = true');
      setIsAdmin(true);
    } else {
      console.log('Setting user as admin = false');
      setIsAdmin(false);
    }
  }, [roleData]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Explicitly clear user and session state on logout
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while signing out');
    }
  };

  const fetchUserRole = async () => {
    if (!user) {
      console.log('No user, skipping role fetch');
      setRoleData(null);
      return;
    }
    
    console.log('Fetching role for user:', user.id);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        setRoleData(null);
      } else {
        console.log('Role data from DB:', data);
        setRoleData(data);
      }
    } catch (err) {
      console.error('Exception in fetchUserRole:', err);
      setRoleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshUserRole,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 