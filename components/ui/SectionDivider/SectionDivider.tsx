import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/lib/theme';

interface SectionDividerProps {
  style?: ViewStyle;
  marginVertical?: number;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  style, 
  marginVertical = 32 
}) => {
  return (
    <View 
      style={[
        {
          height: 1,
          backgroundColor: colors.primitive.purpleAlpha50,
          marginVertical,
        },
        style
      ]} 
    />
  );
};