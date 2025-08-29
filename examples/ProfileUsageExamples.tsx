import { ProfileCard } from '@/components/profile';
import { useProfile, useProfileById } from '@/lib/hooks/useProfile';
import { checkUsernameAvailable, getProfile, getProfileByUsername, updateProfile } from '@/lib/supabase/api/profiles';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * EXAMPLE 1: Using the enhanced AuthProvider (Recommended)
 * This is the easiest way to get the current user's profile
 */
export function Example1_AuthProvider() {
  const { profile, profileLoading, refreshProfile } = useAuth();

  if (profileLoading) {
    return <Text>Loading profile...</Text>;
  }

  if (!profile) {
    return <Text>No profile found</Text>;
  }

  return (
    <View>
      <Text>Current User Profile:</Text>
      <ProfileCard profile={profile} />
      {/* You can refresh profile data */}
      <button onClick={refreshProfile}>Refresh Profile</button>
    </View>
  );
}

/**
 * EXAMPLE 2: Using the useProfile hook
 * Alternative way to get current user's profile with more control
 */
export function Example2_UseProfileHook() {
  const { profile, loading, error, refetch } = useProfile();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!profile) return <Text>No profile found</Text>;

  return (
    <View>
      <ProfileCard profile={profile} />
      <button onClick={refetch}>Refresh</button>
    </View>
  );
}

/**
 * EXAMPLE 3: Getting another user's profile by ID
 */
export function Example3_ProfileById({ userId }: { userId: string }) {
  const { profile, loading, error } = useProfileById(userId);

  if (loading) return <Text>Loading user profile...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!profile) return <Text>User not found</Text>;

  return <ProfileCard profile={profile} compact />;
}

/**
 * EXAMPLE 4: Direct API calls for more complex operations
 */
export function Example4_DirectAPICalls() {
  const handleGetProfile = async (userId: string) => {
    const { profile, error } = await getProfile(userId);
    if (error) {
      console.error('Failed to get profile:', error);
      return;
    }
    console.log('Profile:', profile);
  };

  const handleGetProfileByUsername = async (username: string) => {
    const { profile, error } = await getProfileByUsername(username);
    if (error) {
      console.error('Profile not found:', error);
      return;
    }
    console.log('Profile:', profile);
  };

  const handleUpdateProfile = async (userId: string) => {
    const updates = {
      display_name: 'New Display Name',
      bio: 'Updated bio',
      school: 'New University'
    };

    const { profile, error } = await updateProfile(userId, updates);
    if (error) {
      console.error('Failed to update profile:', error);
      return;
    }
    console.log('Updated profile:', profile);
  };

  const handleCheckUsername = async (username: string) => {
    const { available, error } = await checkUsernameAvailable(username);
    if (error) {
      console.error('Error checking username:', error);
      return;
    }
    console.log(`Username "${username}" is ${available ? 'available' : 'taken'}`);
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.title}>Direct API Examples</Text>
      <Text>Check console for results</Text>
      
      {/* These would be actual buttons in a real implementation */}
      <View style={styles.buttonContainer}>
        <Text>• Get Profile by ID</Text>
        <Text>• Get Profile by Username</Text>
        <Text>• Update Profile</Text>
        <Text>• Check Username Availability</Text>
      </View>
    </View>
  );
}

/**
 * EXAMPLE 5: Complete profile management component
 */
export function Example5_CompleteProfileDemo() {
  const { profile, profileLoading, session } = useAuth();

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Your Profile</Text>
        
        {profile ? (
          <View>
            {/* Main Profile Card */}
            <ProfileCard 
              profile={profile} 
              showStats={true}
              onPress={() => console.log('Navigate to profile edit')}
            />

            {/* Profile Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Profile Details</Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>User ID:</Text>
                <Text style={styles.value}>{profile.id}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{session?.user?.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>Member Since:</Text>
                <Text style={styles.value}>
                  {new Date(profile.created_at).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.label}>Last Updated:</Text>
                <Text style={styles.value}>
                  {new Date(profile.updated_at).toLocaleDateString()}
                </Text>
              </View>

              {profile.phone_number && (
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{profile.phone_number}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <Text>No profile data available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  exampleContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 12,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
});
