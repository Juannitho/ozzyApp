import JamCard from "@/components/ui/Card/CardLg";
import { JamCarousel } from "@/components/ui/Carousel";
import JamEmptyState from "@/components/ui/EmptyState/EmptyState";
import HeaderGreetings from "@/components/ui/Header/HeaderGreetings";
import { LinearGradient } from "@/components/ui/LinearGradient/LinearGradient";
import { FONTS } from "@/lib/customFont/fonts";
import { getUpcomingJams, getUserJoinedJams } from "@/lib/supabase/api/jams";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/AuthProvider";
import { Jam } from "@/types/database.types";
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import 'react-native-url-polyfill/auto';

export default function Index() {
  const { profile, profileLoading } = useAuth();
  const [location, setLocation] = useState<string>('Melbourne, Au');
  const [locationLoading, setLocationLoading] = useState(false);
  const [joinedJams, setJoinedJams] = useState<Jam[]>([]);
  const [jamsLoading, setJamsLoading] = useState(false);
  const [upcomingJams, setUpcomingJams] = useState<Jam[]>([]);
  const [upcomingJamsLoading, setUpcomingJamsLoading] = useState(false);

  const nameTrimmed = profile?.full_name?.trim().split(' ')[0];

  // Request user location
  const requestLocation = async () => {
    try {
      setLocationLoading(true);
      
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get readable address
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address[0]) {
        const { city, region, country } = address[0];
        const locationString = `${city || region}, ${country}`;
        setLocation(locationString);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Fetch joined jams
  const fetchJoinedJams = async (force = false) => {
    if (!profile?.id) return;
    if (jamsLoading && !force) return; // Prevent multiple simultaneous calls
    
    try {
      setJamsLoading(true);
      const { jams, error } = await getUserJoinedJams(profile.id);
      
      if (error) {
        console.error('Error fetching joined jams:', error);
      } else {
        setJoinedJams(jams);
      }
    } catch (error) {
      console.error('Error fetching joined jams:', error);
    } finally {
      setJamsLoading(false);
    }
  };

  // Fetch upcoming jams for carousel
  const fetchUpcomingJams = async () => {
    if (upcomingJamsLoading) return;
    
    try {
      setUpcomingJamsLoading(true);
      const { jams, error } = await getUpcomingJams(8);
      
      if (error) {
        console.error('Error fetching upcoming jams:', error);
      } else {
        setUpcomingJams(jams);
      }
    } catch (error) {
      console.error('Error fetching upcoming jams:', error);
    } finally {
      setUpcomingJamsLoading(false);
    }
  };

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Fetch upcoming jams on component mount
  useEffect(() => {
    fetchUpcomingJams();
  }, []);

  // Fetch joined jams when profile is loaded
  useEffect(() => {
    if (profile?.id) {
      fetchJoinedJams();
    }
  }, [profile?.id]);

  // Refresh jams whenever user returns to this screen
  useFocusEffect(
    useCallback(() => {
      fetchUpcomingJams();
      if (profile?.id) {
        fetchJoinedJams();
      }
    }, [profile?.id])
  );


  if (profileLoading) {
    return (
      <LinearGradient>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primitive.greyPurple} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <HeaderGreetings 
            style={styles.headerGreetings} 
            userName={nameTrimmed || profile?.username || "User"} 
            userLocation={locationLoading ? "Getting location..." : location} 
            avatarURL={profile?.avatar_url || `https://avatar.iran.liara.run/username?username=${nameTrimmed}&bold=true&length=1`}
            onAvatarPress={() => {
              router.push('/userProfile');
            }}
          />

          {/* Jams you might like section */}
          <Text style={styles.jamsYouMightLikeTitle}>Jams you might like</Text>
          {upcomingJamsLoading ? (
            <View style={styles.carouselLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primitive.greyPurple} />
            </View>
          ) : upcomingJams.length > 0 ? (
            <View style={styles.carouselContainer}>
              <JamCarousel 
                jams={upcomingJams} 
                onJamPress={(jam) => {
                  const params = new URLSearchParams({
                    id: jam.id,
                    title: jam.title,
                    description: jam.description || '',
                    category: jam.category,
                    cost_type: jam.cost_type,
                    date: jam.jam_date,
                    start_time: jam.start_time,
                    end_time: jam.end_time || '',
                    location_name: jam.location_name,
                    location_address: jam.location_address || '',
                    location_lat: jam.location_lat?.toString() || '0',
                    location_lng: jam.location_lng?.toString() || '0',
                    max_participants: jam.max_participants.toString(),
                    current_participants: jam.current_participants.toString(),
                    image_url: jam.image_url || '',
                    display_name: jam.host?.display_name || jam.host?.username || 'Host'
                  });
                  router.push(`/jams/${jam.id}?${params.toString()}`);
                }}
              />
            </View>
          ) : null}

          <View style={styles.myJamsSection}>
            <Text style={styles.sectionTitle}>My Upcoming Jams</Text>
            
            {jamsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primitive.greyPurple} />
                <Text style={styles.loadingText}>Loading your jams...</Text>
              </View>
            ) : joinedJams.length > 0 ? (
              <>
                {joinedJams.map((jam) => (
                  <View key={jam.id} style={styles.jamCardContainer}>
                    <JamCard 
                      jam={jam} 
                      onPress={() => {
                        const params = new URLSearchParams({
                          id: jam.id,
                          title: jam.title,
                          description: jam.description || '',
                          category: jam.category,
                          cost_type: jam.cost_type,
                          date: jam.jam_date,
                          start_time: jam.start_time,
                          end_time: jam.end_time || '',
                          location_name: jam.location_name,
                          location_address: jam.location_address || '',
                          location_lat: jam.location_lat?.toString() || '0',
                          location_lng: jam.location_lng?.toString() || '0',
                          max_participants: jam.max_participants.toString(),
                          current_participants: jam.current_participants.toString(),
                          image_url: jam.image_url || '',
                          display_name: jam.host?.display_name || jam.host?.username || 'Host'
                        });
                        router.push(`/jams/${jam.id}?${params.toString()}`);
                      }}
                    />
                  </View>
                ))}
              </>
            ) : (
              <JamEmptyState />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 24,
  },
  myJamsSection: {
    paddingBottom: 40,
  },
  headerGreetings: {
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  profileSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  jamsYouMightLikeTitle: {
    fontSize: 28,
    fontFamily: FONTS.SATOSHI_BLACK,
    marginBottom: 20,
    color: colors.primitive.greyPurple,
  },
  carouselContainer: {
    marginBottom: 40,
  },
  carouselLoadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.SATOSHI_BLACK,
    marginBottom: 16,
    color: colors.primitive.greyPurple,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
  },
  label: {
    fontWeight: '600',
    color: '#1f2937',
  },
  jamCardContainer: {
    marginBottom: 16,
  },
  jamsList: {
    paddingBottom: 20,
  },
});