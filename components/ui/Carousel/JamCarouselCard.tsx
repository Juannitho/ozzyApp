import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';
import { Jam } from '@/types/database.types';
import { ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface JamCarouselCardProps {
  jam: Jam;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.75;
const CARD_HEIGHT = 400;

export default function JamCarouselCard({ jam, onPress }: JamCarouselCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('en-AU', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Background Image */}
      <View style={styles.imageContainer}>
        {jam.image_url ? (
          <Image
            source={{ uri: jam.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderEmoji}>🎯</Text>
          </View>
        )}
        
        {/* Overlay for better text readability */}
        <View style={styles.overlay} />
        
        {/* Cost type Badge */}
        <View style={styles.costBadge}>
          <Text style={styles.costBadgeText}>
            {jam.category}
          </Text>
        </View>

        {/* Content positioned at bottom */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {jam.title}
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.dateTime}>
              {formatDate(jam.jam_date)} • {formatTime(jam.start_time)}
            </Text>
          </View>
          
          <Text style={styles.location} numberOfLines={1}>
            {jam.location_name}
          </Text>
        </View>

        {/* Arrow button */}
        <View style={styles.arrowContainer}>
          <View style={styles.arrowButton}>
            <ArrowUpRight size={40} color={colors.primitive.purple600} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    ...colors.shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 60,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  costBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: '#599CE3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  costBadgeText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FONTS.SATOSHI_MEDIUM,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 80,
  },
  title: {
    fontFamily: FONTS.SATOSHI_BLACK,
    fontSize: 28,
    color: 'white',
    lineHeight: 34,
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 4,
  },
  dateTime: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  location: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
  arrowButton: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: colors.primitive.purple300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
});