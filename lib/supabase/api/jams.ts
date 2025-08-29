// Functions to handle Jams

import {
    JamDetailed,
    JamFilters,
    JamInsert,
    JamSortBy,
    JamUpdate
} from '@/types/database.types';
import { supabase } from '../supabase';

/**
 * Get list of Jams with filters
 */
export async function getJams(filters?: JamFilters, sortBy: JamSortBy = 'date_asc') {
    try {
        let query = supabase
            .from('jams')
            .select(`
          *,
          host:profiles!host_id(*)
        `)
            .eq('status', 'active');

        // Apply filters
        if (filters) {
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.cost_type) {
                query = query.eq('cost_type', filters.cost_type);
            }
            if (filters.date_from) {
                query = query.gte('jam_date', filters.date_from);
            }
            if (filters.date_to) {
                query = query.lte('jam_date', filters.date_to);
            }
            if (filters.search) {
                query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
            }
        }

        // Apply sorting
        switch (sortBy) {
            case 'date_asc':
                query = query.order('jam_date', { ascending: true });
                break;
            case 'date_desc':
                query = query.order('jam_date', { ascending: false });
                break;
            case 'created_at_desc':
                query = query.order('created_at', { ascending: false });
                break;
            case 'participants_asc':
                query = query.order('current_participants', { ascending: true });
                break;
        }

        const { data, error } = await query;

        if (error) throw error;
        return { jams: data || [], error: null };
    } catch (error) {
        console.error('Error getting jams:', error);
        return { jams: [], error: 'Error getting jams' };
    }
}

// Get a Jam with all its details
export async function getJamDetails(jamId: string, userId?: string) {
    try {
        // Get Jam with host and participants
        const { data: jam, error: jamError } = await supabase
            .from('jams')
            .select(`
          *,
          host:profiles!host_id(*),
          participants:jam_participants(
            status,
            joined_at,
            user:profiles!user_id(*)
          )
        `)
            .eq('id', jamId)
            .single();

        if (jamError) throw jamError;
        if (!jam) throw new Error('Jam not found');

        // Check if the user is joined
        let is_joined = false;
        if (userId) {
            const participant = jam.participants.find(p => p.user.id === userId);
            is_joined = participant?.status === 'joined';
        }

        // Check if the user can join
        const can_join = jam.current_participants < jam.max_participants && !is_joined;

        const jamDetailed: JamDetailed = {
            ...jam,
            participants: jam.participants,
            is_joined,
            can_join
        };

        return { jam: jamDetailed, error: null };
    } catch (error) {
        console.error('Error getting jam details:', error);
        return { jam: null, error: 'Error getting jam details' };
    }
}

// Create a Jam
export async function createJam(jamData: JamInsert) {
    try {
        const { data, error } = await supabase
            .from('jams')
            .insert(jamData)
            .select()
            .single();

        if (error) throw error;
        return { jam: data, error: null };
    } catch (error) {
        console.error('Error creating jam:', error);
        return {
            jam: null,
            error: error instanceof Error ? error.message : 'Error creating jam'
        };
    }
}

// Update a Jam
export async function updateJam(jamId: string, updates: JamUpdate) {
    try {
        const { data, error } = await supabase
            .from('jams')
            .update(updates)
            .eq('id', jamId)
            .select()
            .single();

        if (error) throw error;
        return { jam: data, error: null };
    } catch (error) {
        console.error('Error updating jam:', error);
        return {
            jam: null,
            error: error instanceof Error ? error.message : 'Error updating jam'
        };
    }
}

// Cancel a Jam
export async function cancelJam(jamId: string) {
    try {
        const { error } = await supabase
            .from('jams')
            .update({ status: 'cancelled' })
            .eq('id', jamId);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error canceling jam:', error);
        return { success: false, error: 'Error canceling jam' };
    }
}

// Join a Jam
export async function joinJam(jamId: string, userId: string) {
    try {
        // Check if the user is already joined
        const { data: existing } = await supabase
            .from('jam_participants')
            .select('id')
            .eq('jam_id', jamId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existing) {
            return { success: false, error: 'You are already joined to this jam' };
        }

        // Join the Jam
        const { error } = await supabase
            .from('jam_participants')
            .insert({
                jam_id: jamId,
                user_id: userId,
                status: 'joined'
            });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error joining jam:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error joining jam'
        };
    }
}

// Leave a Jam
export async function leaveJam(jamId: string, userId: string) {
    try {
        const { error } = await supabase
            .from('jam_participants')
            .delete()
            .eq('jam_id', jamId)
            .eq('user_id', userId);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error leaving jam:', error);
        return { success: false, error: 'Error leaving jam' };
    }
}

// Get Jams created by a user
export async function getUserHostedJams(userId: string) {
    try {
        const { data, error } = await supabase
            .from('jams')
            .select('*')
            .eq('host_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { jams: data || [], error: null };
    } catch (error) {
        console.error('Error getting jams created by user:', error);
        return { jams: [], error: 'Error getting jams created by user' };
    }
}

// Get Jams joined by a user
export async function getUserJoinedJams(userId: string) {
    try {
        const { data, error } = await supabase
            .from('jam_participants')
            .select(`
          jam:jams(
            *,
            host:profiles!host_id(*)
          )
        `)
            .eq('user_id', userId)
            .eq('status', 'joined');

        if (error) throw error;

        const jams = data?.map(item => item.jam).filter(Boolean) || [];
        return { jams, error: null };
    } catch (error) {
        console.error('Error getting jams joined by user:', error);
        return { jams: [], error: 'Error getting jams joined by user' };
    }
}

// Get participants of a Jam
export async function getJamParticipants(jamId: string) {
    try {
        const { data, error } = await supabase
            .from('jam_participants')
            .select(`
          *,
          user:profiles!user_id(*)
        `)
            .eq('jam_id', jamId)
            .eq('status', 'joined');

        if (error) throw error;
        return { participants: data || [], error: null };
    } catch (error) {
        console.error('Error getting participants:', error);
        return { participants: [], error: 'Error getting participants' };
    }
}