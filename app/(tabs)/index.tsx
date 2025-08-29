import JamEmptyState from "@/components/ui/EmptyState/EmptyState";
import HeaderGreetings from "@/components/ui/Header/HeaderGreetings";
import { LinearGradient } from "@/components/ui/LinearGradient/LinearGradient";
import { FONTS } from "@/lib/customFont/fonts";
import { colors } from "@/lib/theme";
import { useAuth } from "@/providers/AuthProvider";
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import 'react-native-url-polyfill/auto';

export default function Index() {
  const { profile, profileLoading } = useAuth();
  const [location, setLocation] = useState<string>('Melbourne, Au');
  const [locationLoading, setLocationLoading] = useState(false);

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

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);


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
        <HeaderGreetings 
          style={styles.headerGreetings} 
          userName={nameTrimmed || profile?.username || "User"} 
          userLocation={locationLoading ? "Getting location..." : location} 
          avatarURL={profile?.avatar_url || `https://avatar.iran.liara.run/username?username=${nameTrimmed}&bold=true&length=1`}
          onAvatarPress={() => {
            router.push('/userProfile');
          }}
        />


        <Text style={styles.sectionTitle}>Upcoming Jams</Text>
        <JamEmptyState />
        
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
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
});