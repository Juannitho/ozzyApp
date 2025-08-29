// Categories available for Jams
export type JamCategory =
    | 'Adventure'
    | 'Food'
    | 'Culture'
    | 'Study'
    | 'Volunteering'
    | 'Trivia';

// Cost types
export type CostType = 'Free' | 'Paid';

// Visibility levels
export type VisibilityType = 'Public' | 'Friends Only' | 'Private';

// Jam status
export type JamStatus = 'active' | 'cancelled' | 'completed';

// Participant status
export type ParticipantStatus = 'joined' | 'pending' | 'cancelled';

// User Profile
export interface Profile {
    id: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    country_flag: string | null;
    full_name: string | null;
    phone_number: string | null;
    school: string | null;

    // Counters
    jams_joined: number;
    jams_created: number;

    // Timestamps (ISO strings)
    // TODO: Add timezone
    created_at: string;
    updated_at: string;
}

// Type for creating/updating profile 
export interface ProfileInsert {
    id?: string;
    username: string;
    display_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    country_flag?: string | null;
}

export interface ProfileUpdate {
    username?: string;
    display_name?: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    country_flag?: string | null;
}

// Jam
export interface Jam {
    // Identifiers
    id: string;
    host_id: string;

    // Basic information
    title: string;
    description: string | null;
    category: JamCategory;

    // Location
    location_name: string;
    location_address: string | null;
    location_lat: number | null;
    location_lng: number | null;
    meeting_point: string | null;

    // Date and time
    jam_date: string;
    start_time: string;
    end_time: string | null;
    duration_hours: number | null;

    // Participants
    max_participants: number;
    current_participants: number;

    // Cost
    cost_type: CostType;
    cost_amount: number | null;

    // Configuration
    visibility: VisibilityType;
    image_url: string | null;
    status: JamStatus;

    // Timestamps
    created_at: string;
    updated_at: string;
}

// Type for creating a new Jam
export interface JamInsert {
    // Required
    title: string;
    category: JamCategory;
    location_name: string;
    jam_date: string;
    start_time: string;
    host_id: string;

    // Optional
    description?: string | null;
    location_address?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    meeting_point?: string | null;
    end_time?: string | null;
    duration_hours?: number | null;
    max_participants?: number;
    cost_type?: CostType;
    cost_amount?: number | null;
    visibility?: VisibilityType;
    image_url?: string | null;
    status?: JamStatus;
}

// Type for updating a Jam
export interface JamUpdate {
    title?: string;
    description?: string | null;
    category?: JamCategory;
    location_name?: string;
    location_address?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
    meeting_point?: string | null;
    jam_date?: string;
    start_time?: string;
    end_time?: string | null;
    duration_hours?: number | null;
    max_participants?: number;
    cost_type?: CostType;
    cost_amount?: number | null;
    visibility?: VisibilityType;
    image_url?: string | null;
    status?: JamStatus;
}

// Jam Participant
export interface JamParticipant {
    id: string;
    jam_id: string;
    user_id: string;
    status: ParticipantStatus;
    joined_at: string;
}

// Type for joining a Jam
export interface JamParticipantInsert {
    jam_id: string;
    user_id: string;
    status?: ParticipantStatus;
}

// Jam with host information
export interface JamWithHost extends Jam {
    host: Profile;
}

// Jam with participants list
export interface JamWithParticipants extends Jam {
    participants: Array<{
        user: Profile;
        status: ParticipantStatus;
        joined_at: string;
    }>;
}

// Jam with all information
export interface JamDetailed extends Jam {
    host: Profile;
    participants: Array<{
        user: Profile;
        status: ParticipantStatus;
        joined_at: string;
    }>;
    is_joined: boolean;
    can_join: boolean;
}

// Profile with Jams created
export interface ProfileWithJams extends Profile {
    hosted_jams: Jam[];
    joined_jams: Jam[];
}

// RESPONSE TYPES FROM SUPABASE

// Generic Supabase response
export interface SupabaseResponse<T> {
    data: T | null;
    error: Error | null;
}

// Supabase error
export interface SupabaseError {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
}

// FORM TYPES (with Zod)

// Schema for the create Jam form (3 steps)
export interface CreateJamFormData {
    // Step 1: Basic Details
    title: string;
    category: JamCategory;
    description: string;

    // Step 2: Location & Time
    location_name: string;
    location_address?: string;
    meeting_point?: string;
    jam_date: string;
    start_time: string;
    end_time?: string;
    duration_hours: number;
    cost_type: CostType;
    cost_amount?: number;

    // Step 3: Participants & Settings
    max_participants: number;
    visibility: VisibilityType;

    // Image (uploaded later)
    image?: string;
}

// Schema for updating profile
export interface UpdateProfileFormData {
    username: string;
    display_name: string;
    bio?: string;
    country_flag?: string;
    avatar?: string;  // To handle the image before uploading
}

// FILTERS AND SEARCH TYPES

// Filters for searching Jams
export interface JamFilters {
    category?: JamCategory;
    cost_type?: CostType;
    date_from?: string;
    date_to?: string;
    location?: string;
    search?: string;  // Search in title/description
}

// Sorting options
export type JamSortBy =
    | 'date_asc'
    | 'date_desc'
    | 'created_at_desc'
    | 'participants_asc';

// GLOBAL STATE TYPES (Zustand)

export interface AuthState {
    user: Profile | null;
    session: any | null;  // Supabase session
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface JamState {
    jams: Jam[];
    currentJam: JamDetailed | null;
    myJams: Jam[];
    joinedJams: Jam[];
    filters: JamFilters;
    isLoading: boolean;
    error: string | null;
}

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile;                    
                Insert: ProfileInsert;            
                Update: ProfileUpdate;            
                Relationships: [];
            };
            jams: {
                Row: Jam;
                Insert: JamInsert;
                Update: JamUpdate;
                Relationships: [
                    {
                        foreignKeyName: "jams_host_id_fkey";
                        columns: ["host_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            jam_participants: {
                Row: JamParticipant;
                Insert: JamParticipantInsert;
                Update: Partial<JamParticipantInsert>;
                Relationships: [
                    {
                        foreignKeyName: "jam_participants_jam_id_fkey";
                        columns: ["jam_id"];
                        referencedRelation: "jams";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "jam_participants_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {};
        Functions: {};
        Enums: {
            jam_category: JamCategory;
            cost_type: CostType;
            visibility_type: VisibilityType;
            jam_status: JamStatus;
            participant_status: ParticipantStatus;
        };
        CompositeTypes: {};
    };
};


// UTILITY TYPES

// Helper to make all fields optional except the ID
export type PartialExceptId<T> = Partial<T> & { id: string };

// Helper to omit automatic fields
export type OmitAutoFields<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

// Helper for form fields
export type FormFields<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'host_id'>;

// Router params for Jam details page
export type JamDetailsParams = {
    id?: string;
    title?: string;
    image_url?: string;
    description?: string;
    category?: string;
    cost_type?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    meeting_point?: string;
    location_name?: string;
    location_lng?: string;
    location_lat?: string;
    location_address?: string;
    display_name?: string;
    max_participants?: string;
    current_participants?: string;
};
