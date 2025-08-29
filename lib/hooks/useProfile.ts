import { getProfile } from '@/lib/supabase/api/profiles';
import { useAuth } from '@/providers/AuthProvider';
import { Profile } from '@/types/database.types';
import { useEffect, useState } from 'react';

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage user profile data
 * Automatically fetches profile when user is authenticated
 */
export function useProfile(): UseProfileReturn {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { profile: profileData, error: profileError } = await getProfile(session.user.id);
      
      if (profileError) {
        setError(profileError);
        setProfile(null);
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Error in useProfile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when session changes
  useEffect(() => {
    fetchProfile();
  }, [session?.user?.id]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}

/**
 * Hook to get profile by specific user ID
 * Useful for displaying other users' profiles
 */
export function useProfileById(userId: string | null): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { profile: profileData, error: profileError } = await getProfile(userId);
      
      if (profileError) {
        setError(profileError);
        setProfile(null);
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Error in useProfileById:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
