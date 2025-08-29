import { Button, LinearGradient, SectionDivider, SectionTitle } from '@/components/ui';
import HeaderTitleIcon from '@/components/ui/Header/HeaderTitleIcon';
import IconDescriptor from '@/components/ui/IconDescriptor/IconDescriptor';
import { MeetingPointMap } from '@/components/ui/Map/MeetingPointMap';
import Tag from '@/components/ui/Tags/Tags';
import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';
import { formatDateTimeRange } from '@/lib/utils/dateTime';
import { JamDetailsParams } from '@/types/database.types';
import { useLocalSearchParams } from 'expo-router';
import { CalendarIcon, Navigation } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';



export default function JamDetails() {
  const params = useLocalSearchParams<JamDetailsParams>();
  
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
            <Image source={{ uri: image_url }} style={styles.image} />
            <View style={styles.tagsContainer}>
              <Tag label={category} />
              <Tag label={cost_type} />
            </View>
          </View>
          
          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
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
            description={`${location_address} \n${location_name}`} 
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
            <Text style={styles.hostName}>{display_name}</Text>
          </View>
          
          <SectionDivider />
          {/* Join Button */}
          <Button 
            title="Join jam" 
            variant="filled" 
            size="large" 
            fullWidth 
            subtitle={`${spotsData.spotsAvailable} spots available`}
            disabled={spotsData.isFull}
          />
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
});