import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a maximum timeout for loading state (3 seconds)
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Loading timeout reached, forcing loading to false');
      setLoading(false);
    }, 3000);

    // Check active session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Fetch profile but don't block on it
          fetchUserProfile(session.user.id).finally(() => {
            clearTimeout(loadingTimeout);
          });
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error('Init auth error:', error);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          setUser(session.user);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      console.log('📝 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no row found

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setUserProfile(null);
      } else if (data) {
        console.log('✅ User profile loaded:', data.email);
        setUserProfile(data);
      } else {
        console.warn('⚠️ No user profile found in database');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Exception fetching user profile:', error);
      setUserProfile(null);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state immediately
      setUser(null);
      setUserProfile(null);
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Clear local state anyway
      setUser(null);
      setUserProfile(null);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  // Show loading state with timeout protection
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f7fafc'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#1a5490',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '1.1rem' }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
