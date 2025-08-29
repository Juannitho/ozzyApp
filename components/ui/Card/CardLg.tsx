
import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';
import { Jam } from '@/types/database.types';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Tag from '../Tags/Tags';

// Props que recibe el componente
interface JamCardProps {
  jam: Jam;
  onPress?: () => void;
}

export default function JamCard({ jam, onPress }: JamCardProps) {
  // Formatear la fecha en formato legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('en-AU', options);
  };

  // Formatear hora (de 24hr a 12hr con AM/PM)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calcular spots disponibles
  const spotsAvailable = jam.max_participants - jam.current_participants;
  const isFull = spotsAvailable === 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Imagen del Jam */}
      <View style={styles.imageContainer}>
        {jam.image_url ? (
          <Image
            source={{ uri: jam.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          // Placeholder si no hay imagen
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>📍</Text>
          </View>
        )}

        {/* Badges sobre la imagen */}
        <View style={styles.badges}>
          <Tag label={jam.category} />
          {jam.cost_type === 'Free' ? (
            <Tag label="Free" />
          ) : (
            <Tag label={`$${jam.cost_amount}`} />
          )}
        </View>
      </View>

      {/* Contenido del Jam */}
      <View style={styles.content}>

        {/* Fecha y Hora */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {formatDate(jam.jam_date)} • {formatTime(jam.start_time)}
          </Text>
        </View>

        {/* Título */}
        <Text style={styles.title} numberOfLines={2}>
          {jam.title}
        </Text>



        {/* Participantes */}
        <View style={styles.footer}>
          <View style={styles.participantsContainer}>
            <Text style={[styles.participantsText, isFull && styles.fullText]}>
              {jam.current_participants}/{jam.max_participants} joined
            </Text>
          </View>

          {/* Indicador de disponibilidad */}
          {isFull ? (
            <View style={styles.fullIndicator}>
              <Text style={styles.fullIndicatorText}>FULL</Text>
            </View>
          ) : (
            <View style={styles.spotsIndicator}>
              <Text style={styles.spotsText}>
                {spotsAvailable} {spotsAvailable === 1 ? 'spot' : 'spots'} left
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primitive.white,
    borderRadius: 24,
    marginHorizontal: 4,
    ...colors.shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 50,
  },
  badges: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  category: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#599CE3",
  },
  categoryBadge: {
    backgroundColor: "#599CE3",
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONTS.SATOSHI_BOLD,
  },
  freeBadge: {
    backgroundColor: "#599CE3",
  },
  freeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  paidBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paidText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 24,
    color: colors.primitive.purple600,
    lineHeight: 26,
    wordWrap: 'break-word',
    width: '90%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 16,
    lineHeight: 22,
    color: colors.primitive.grey900,
    flex: 1,
  },
  footer: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.primitive.blueAlpha10,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  fullText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  spotsIndicator: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  spotsText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  fullIndicator: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  fullIndicatorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
});