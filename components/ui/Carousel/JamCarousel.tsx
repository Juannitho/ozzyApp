import { Jam } from '@/types/database.types';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import JamCarouselCard from './JamCarouselCard';

interface JamCarouselProps {
  jams: Jam[];
  onJamPress: (jam: Jam) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.75;
const CARD_SPACING = 16;

export default function JamCarousel({ jams, onJamPress }: JamCarouselProps) {
  const renderItem = ({ item, index }: { item: Jam; index: number }) => (
    <View style={styles.cardContainer}>
      <JamCarouselCard 
        jam={item} 
        onPress={() => onJamPress(item)} 
        isFirst={index === 0}
        isLast={index === jams.length - 1}
      />
    </View>
  );

  return (
    <FlatList
      data={jams}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + CARD_SPACING}
      decelerationRate="fast"
      contentContainerStyle={styles.contentContainer}
      pagingEnabled={false}
      snapToAlignment="start"
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
});