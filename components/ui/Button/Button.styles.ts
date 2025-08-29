import { FONTS, typography } from '@/lib/customFont/fonts';
import colors from '@/theme/colors';
import { StyleSheet } from 'react-native';

// Base container styles
export const baseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  subtitle: {
    fontFamily: FONTS.SATOSHI_MEDIUM,
    fontSize: 14,
    color: colors.primitive.purple200,
    marginTop: -8,
  },
});

// Styles according to variant
export const variantStyles = StyleSheet.create({
  filled: {
    backgroundColor: colors.primitive.purple600,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: colors.primitive.transparent,
    borderWidth: 2,
    borderColor: colors.primitive.purple600,
  },
  ghost: {
    backgroundColor: colors.primitive.transparent,
    borderWidth: 0,
  },
  text: {
    backgroundColor: colors.primitive.transparent,
    borderWidth: 0,
  },
});

// Styles according to size
export const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
});

// Text styles according to variant
export const textVariantStyles = StyleSheet.create({
  filled: {
    ...typography.buttonText, 
    color: colors.primitive.purple100,
    elevation: 10,
  },
  outline: {
    ...typography.buttonText, 
    color: colors.primitive.purple600,
  },
  ghost: {
    ...typography.buttonText, 
    color: colors.textPrimary,
  },
  text: {
    ...typography.buttonText, 
    fontFamily: FONTS.SATOSHI_MEDIUM,
    color: colors.primitive.purple600,
  },
});

// Text styles according to size
export const textSizeStyles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    fontSize: 18,
    lineHeight: 28,
  },
});

// Icon styles
export const iconStyles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 4,
  },
  iconOnly: {
    paddingHorizontal: 0,
    aspectRatio: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});