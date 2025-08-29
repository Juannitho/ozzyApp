import { ReactNode } from 'react';
import { ColorValue, ViewStyle } from 'react-native';

export interface LinearGradientProps {
  children: ReactNode;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
}