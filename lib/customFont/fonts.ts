import { TextStyle } from 'react-native';

export const FONTS = {
  CLASH_DISPLAY_BOLD: 'ClashDisplay-Bold',
  CLASH_DISPLAY_SEMIBOLD: 'ClashDisplay-Semibold',
  CLASH_DISPLAY_MEDIUM: 'ClashDisplay-Medium',
  CLASH_DISPLAY_REGULAR: 'ClashDisplay-Regular',
  SATOSHI_BOLD: 'Satoshi-Bold',
  SATOSHI_MEDIUM: 'Satoshi-Medium',
  SATOSHI_REGULAR: 'Satoshi-Regular',
  SATOSHI_BLACK: 'Satoshi-Black',
  SATOSHI_LIGHT: 'Satoshi-Light',
}

interface TypographyStyles {
  // Títulos con Clash Display
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  
  // Texto con Satoshi
  bodyLarge: TextStyle;
  bodyRegular: TextStyle;
  bodySmall: TextStyle;
  
  // Botones y Labels
  buttonText: TextStyle;
  label: TextStyle;
  caption: TextStyle;
}

export const typography: TypographyStyles = {
  // Headers - Clash Display
  h1: {
    fontFamily: FONTS.CLASH_DISPLAY_BOLD,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONTS.CLASH_DISPLAY_SEMIBOLD,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FONTS.CLASH_DISPLAY_MEDIUM,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: FONTS.CLASH_DISPLAY_REGULAR,
    fontSize: 18,
    lineHeight: 24,
  },
  
  // Body - Satoshi
  bodyLarge: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyRegular: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // UI Elements
  buttonText: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: FONTS.SATOSHI_MEDIUM,
    fontSize: 14,
    lineHeight: 18,
  },
  caption: {
    fontFamily: FONTS.SATOSHI_REGULAR,
    fontSize: 11,
    lineHeight: 14,
  },
};