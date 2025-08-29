import React from 'react';
import { Text, TextStyle } from 'react-native';
import { FONTS } from '@/lib/customFont/fonts';
import { colors } from '@/lib/theme';

interface SectionTitleProps {
  children: string;
  style?: TextStyle;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, style }) => {
  return (
    <Text 
      style={[
        {
          fontFamily: FONTS.SATOSHI_BLACK,
          fontSize: 18,
          lineHeight: 24,
          color: colors.primitive.greyPurple,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
};