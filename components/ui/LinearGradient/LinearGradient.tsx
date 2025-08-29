import { colors } from '@/lib/theme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradientProps } from './LinearGradient.types';

export const LinearGradient: React.FC<LinearGradientProps> = ({
  children,
  colors: customColors = [colors.primitive.purpleAlpha50, colors.primitive.white] as const,
  start = { x: 0.3, y: 0 },
  end = { x: 0.5, y: 0.5 },
  style,
}) => {
  return (
    <ExpoLinearGradient
      colors={customColors}
      style={[styles.gradient, style]}
      start={start}
      end={end}
    >
      {children}
    </ExpoLinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
}); 