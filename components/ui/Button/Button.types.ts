import { ReactNode } from 'react';
import { PressableProps, TextStyle, ViewStyle } from 'react-native';

// Styles
export type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'text';

// Sizes
export type ButtonSize = 'small' | 'medium' | 'large';

// Button props
export interface ButtonProps extends Omit<PressableProps, 'style'> {
  // Button content
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  
  // Visual styles
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  
  // States
  loading?: boolean;
  disabled?: boolean;
  
  // Icons
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  
  // Custom styles
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Custom colors (optional)
  color?: string;
  textColor?: string;
}