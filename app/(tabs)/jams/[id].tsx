import { Button, LinearGradient, SectionDivider, SectionTitle } from '@/components/ui';
import HeaderTitleIcon from '@/components/ui/Header/HeaderTitleIcon';
import IconDescriptor from '@/components/ui/IconDescriptor/IconDescriptor';
import { MeetingPointMap } from '@/components/ui/Map/MeetingPointMap';
import Tag from '@/components/ui/Tags/Tags';
import { FONTS } from '@/lib/customFont/fonts';
import { getJamDetails, joinJam, leaveJam } from '@/lib/supabase/api/jams';
import { colors } from '@/lib/theme';
import { formatDateTimeRange } from '@/lib/utils/dateTime';
import { useAuth } from '@/providers/AuthProvider';
import { JamDetailed, JamDetailsParams } from '@/types/database.types';
import { useLocalSearchParams } from 'expo-router';
import { CalendarIcon, Navigation } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';



export default function JamDetails() {
  const params = useLocalSearchParams<JamDetailsParams>();
  const { profile } = useAuth();
  
  // State management
  const [jamDetails, setJamDetails] = useState<JamDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Safely destructure with defaults
  const {
    id,
    title = '',
    image_url = '',
    description = '',
    category = '',
    cost_type = '',
    date = '',
    start_time = '',
    end_time = '',
    location_name = '',
    location_lng = '0',
    location_lat = '0',
    location_address = '',
    display_name = '',
    max_participants = '0',
    current_participants = '0'
  } = params;

  // Memoized calculations
  const spotsData = useMemo(() => {
    const maxParticipants = Number(max_participants) || 0;
    const currentParticipants = Number(current_participants) || 0;
    const spotsAvailable = Math.max(0, maxParticipants - currentParticipants);
    const isFull = spotsAvailable === 0;
    
    return { spotsAvailable, isFull, maxParticipants, currentParticipants };
  }, [max_participants, current_participants]);

  const locationData = useMemo(() => ({
    latitude: Number(location_lat) || 0,
    longitude: Number(location_lng) || 0,
    address: location_address,
    placeName: location_name
  }), [location_lat, location_lng, location_address, location_name]);

  const dateTimeDescription = useMemo(() => 
    formatDateTimeRange(date, start_time, end_time),
    [date, start_time, end_time]
  );

  // Fetch jam details with join status
  const fetchJamDetails = async () => {
    if (!id || !profile?.id) {
      console.log('Missing id or profile:', { id, profileId: profile?.id });
      return;
    }
    
    try {
      console.log('Fetching jam details for:', { jamId: id, userId: profile.id });
      setLoading(true);
      const { jam, error } = await getJamDetails(id, profile.id);
      
      if (error) {
        console.error('Error fetching jam details:', error);
        Alert.alert('Error', 'Failed to load jam details');
      } else {
        console.log('Jam details fetched successfully:', jam);
        setJamDetails(jam);
      }
    } catch (error) {
      console.error('Error fetching jam details:', error);
      Alert.alert('Error', 'Failed to load jam details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jam details when component mounts or id/profile changes
  useEffect(() => {
    console.log('useEffect triggered with:', { id, profileId: profile?.id, hasProfile: !!profile });
    if (id && profile?.id) {
      fetchJamDetails();
    }
  }, [id, profile?.id]);

  // Handle join jam
  const handleJoinJam = async () => {
    if (!id || !profile?.id) return;
    
    try {
      setActionLoading(true);
      const { success, error } = await joinJam(id, profile.id);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', 'You have successfully joined this jam!');
        // Refetch jam details to update join status
        await fetchJamDetails();
      }
    } catch (error) {
      console.error('Error joining jam:', error);
      Alert.alert('Error', 'Failed to join jam');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle leave jam
  const handleLeaveJam = async () => {
    if (!id || !profile?.id) return;
    
    Alert.alert(
      'Leave Jam',
      'Are you sure you want to leave this jam?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              const { success, error } = await leaveJam(id, profile.id);
              
              if (error) {
                Alert.alert('Error', error);
              } else {
                Alert.alert('Success', 'You have left this jam');
                // Refetch jam details to update join status
                await fetchJamDetails();
              }
            } catch (error) {
              console.error('Error leaving jam:', error);
              Alert.alert('Error', 'Failed to leave jam');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  // Show loading state
  if (loading) {
    return (
      <LinearGradient>
        <SafeAreaView style={styles.container}>
          <HeaderTitleIcon pageTitle="Jam details" showShareButton={false} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primitive.greyPurple} />
            <Text style={styles.loadingText}>Loading jam details...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Use jam details from state if available, otherwise fallback to params
  const currentJam = jamDetails || params;
  const actualSpotsData = jamDetails ? {
    spotsAvailable: Math.max(0, jamDetails.max_participants - jamDetails.current_participants),
    isFull: jamDetails.max_participants - jamDetails.current_participants === 0,
    maxParticipants: jamDetails.max_participants,
    currentParticipants: jamDetails.current_participants
  } : spotsData;

  // Use current jam data for display (either from API or URL params)
  const displayData = {
    title: jamDetails?.title || title,
    description: jamDetails?.description || description,
    image_url: jamDetails?.image_url || image_url,
    category: jamDetails?.category || category,
    cost_type: jamDetails?.cost_type || cost_type,
    location_address: jamDetails?.location_address || location_address,
    location_name: jamDetails?.location_name || location_name,
    display_name: jamDetails?.host?.display_name || jamDetails?.host?.username || display_name,
  };

  return (
    <LinearGradient>
      <SafeAreaView style={styles.container}>
        <HeaderTitleIcon pageTitle="Jam details" showShareButton={false} />
        <ScrollView
          style={styles.wrapper}
          contentContainerStyle={{ paddingBottom: 56 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image source={{ uri: displayData.image_url }} style={styles.image} />
            <View style={styles.tagsContainer}>
              <Tag label={displayData.category} />
              <Tag label={displayData.cost_type} />
            </View>
          </View>
          
          {/* Content */}
          <Text style={styles.title}>{displayData.title}</Text>
          <Text style={styles.description}>{displayData.description}</Text>
          <SectionDivider />
          {/* Date and Location Info */}
          <IconDescriptor 
            icon={<CalendarIcon size={24} color={colors.primitive.blue600} />} 
            title="Date and time" 
            description={dateTimeDescription}
          />
          <IconDescriptor 
            icon={<Navigation size={24} color={colors.primitive.blue600} />} 
            title="Location" 
            description={`${displayData.location_address} \n${displayData.location_name}`} 
          />

          <SectionDivider />

          {/* Meeting Point Section */}
          <SectionTitle>Meeting point</SectionTitle>
          <MeetingPointMap
            latitude={locationData.latitude}
            longitude={locationData.longitude}
            address={locationData.address}
            placeName={locationData.placeName}
          />
          
          <SectionDivider />
          
          {/* Host Section */}
          <SectionTitle>Meet your host</SectionTitle>
          <View style={styles.hostSection}>
            <Text style={styles.hostName}>{displayData.display_name}</Text>
          </View>
          
          <SectionDivider />
          {/* Join/Leave Button */}
          {jamDetails?.is_joined ? (
            <Button 
              title="Leave jam" 
              variant="outline" 
              size="large" 
              fullWidth 
              subtitle=""
              disabled={actionLoading}
              onPress={handleLeaveJam}
            />
          ) : (
            <Button 
              title={actionLoading ? "Joining..." : "Join jam"}
              variant="filled" 
              size="large" 
              fullWidth 
              subtitle={actualSpotsData.isFull ? "Jam is full" : `${actualSpotsData.spotsAvailable} spots available`}
              disabled={actualSpotsData.isFull || actionLoading}
              onPress={handleJoinJam}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
  },
  wrapper: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 24,
  },
  tagsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 24,
    lineHeight: 28,
    paddingTop: 32,
    paddingBottom: 8,
    color: colors.primitive.greyPurple,
  },
  description: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 18,
    lineHeight: 24,
    color: colors.primitive.grey800,
  },
  hostSection: {
    paddingVertical: 8,
  },
  hostName: {
    fontFamily: FONTS.SATOSHI_MEDIUM,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primitive.greyPurple,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.primitive.grey800,
    fontFamily: FONTS.SATOSHI_REGULAR,
  },
});