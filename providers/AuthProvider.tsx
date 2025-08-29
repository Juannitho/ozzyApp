import { getProfile } from '@/lib/supabase/api/profiles';
import { Profile } from '@/types/database.types';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabase';

type AuthData = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  profileLoading: true,
  refreshProfile: async () => {},
});

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);

    // Function to fetch user profile
    const fetchProfile = async (userId: string) => {
        try {
            setProfileLoading(true);
            const { profile: profileData, error: profileError } = await getProfile(userId);
            
            if (profileError) {
                console.error('Profile error:', profileError);
                setProfile(null);
            } else {
                setProfile(profileData);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setProfile(null);
        } finally {
            setProfileLoading(false);
        }
    };

    // Function to refresh profile data
    const refreshProfile = async () => {
        if (session?.user?.id) {
            await fetchProfile(session.user.id);
        }
    };

    useEffect(() => {
        async function getSession() {
            const {error, data} = await supabase.auth.getSession();
            
            if (error) {
                console.error('Session error:', error.message);
                // Clear any corrupted session data
                await supabase.auth.signOut();
                setSession(null);
                setProfile(null);
                router.replace('/(auth)/login');
                setLoading(false);
                setProfileLoading(false);
                return;
            }

            if(data.session) {
                setSession(data.session);
                // Fetch profile after setting session
                await fetchProfile(data.session.user.id);
                // Redirect to tabs if user is already authenticated
                router.replace('/(tabs)');
            } else {
                setProfile(null);
                setProfileLoading(false);
                router.replace('/(auth)/login');
            }

            setLoading(false);
        }

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setLoading(true);
            
            if (event === 'SIGNED_OUT') {
                setSession(null);
                setProfile(null);
                setProfileLoading(false);
                router.replace('/(auth)/login');
            } else if (event === 'TOKEN_REFRESHED' && session) {
                setSession(session);
                await fetchProfile(session.user.id);
                router.replace('/(tabs)');
            } else if (event === 'SIGNED_IN' && session) {
                setSession(session);
                await fetchProfile(session.user.id);
                router.replace('/(tabs)');
            } else if (!session) {
                setSession(null);
                setProfile(null);
                setProfileLoading(false);
                router.replace('/(auth)/login');
            }
            
            setLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            session, 
            profile, 
            loading, 
            profileLoading, 
            refreshProfile 
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);