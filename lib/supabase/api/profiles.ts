import { ProfileUpdate } from '@/types/database.types';
import { supabase } from '../supabase';

// Get the profile by ID
export async function getProfile(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { profile: data, error: null };
    } catch (error) {
        console.error('Error getting profile:', error);
        return {
            profile: null,
            error: error instanceof Error ? error.message : 'Error getting profile'
        };
    }
}

// Get the profile by username
export async function getProfileByUsername(username: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error) throw error;
        return { profile: data, error: null };
    } catch (error) {
        console.error('Error getting profile by username:', error);
        return { profile: null, error: 'Profile not found' };
    }
}

// Update the profile
export async function updateProfile(userId: string, updates: ProfileUpdate) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { profile: data, error: null };
    } catch (error) {
        console.error('Error updating profile:', error);
        return {
            profile: null,
            error: error instanceof Error ? error.message : 'Error updating profile'
        };
    }
}

/**
 * Check if a username is available
 */
export async function checkUsernameAvailable(username: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
  
      if (error) throw error;
      return { available: !data, error: null };
    } catch (error) {
      console.error('Error checking username:', error);
      return { available: false, error: 'Error checking availability' };
    }
  }