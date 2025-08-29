import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabase';

type AuthData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        async function getSession() {
            const {error, data} = await supabase.auth.getSession();
            
            if (error) {
                console.error('Session error:', error.message);
                // Clear any corrupted session data
                await supabase.auth.signOut();
                setSession(null);
                router.replace('/(auth)/login');
                setLoading(false);
                return;
            }

            if(data.session) {
                setSession(data.session);
                // Redirect to tabs if user is already authenticated
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/login');
            }

            setLoading(false);
        }

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setLoading(true);
            
            if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    setSession(session);
                    router.replace('/(tabs)');
                } else {
                    setSession(null);
                    router.replace('/(auth)/login');
                }
            } else if (session) {
                setSession(session);
                router.replace('/(tabs)');
            } else {
                setSession(null);
                router.replace('/(auth)/login');
            }
            
            setLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);