// primary tokens

const primitiveColors = {
    // Blue
    blue100: '#73afe4',
    blue200: '#8bbce9',
    blue300: '#a2caee',
    blue400: '#5988b3',
    blue500: '#406484',
    blue600: '#284158',
    blueAlpha10: '#73afe419',
    blueAlpha50: '#73afe47f',

    // Purple
    purple100: '#dfc8f9',
    purple200: '#e4d1fa',
    purple300: '#efe3fc',
    purple400: '#af9cc3',
    purple500: '#817390',
    purple600: '#564c61',
    purpleAlpha10: '#dfc8f933',
    purpleAlpha50: '#dfc8f97f',

    // Yellow
    yellow100: '#faefae',
    yellow200: '#f9eb97',
    yellow300: '#f8e67f',
    yellow400: '#c3b462',
    yellow500: '#908547',
    yellow600: '#60592d',
    yellowAlpha10: '#f8e67f19',
    yellowAlpha50: '#f8e67f7f',

    // Grey
    grey200: '#e8e8e8',
    grey300: '#d2d2d2',
    grey400: '#bbbbbb',
    grey500: '#a4a4a4',
    grey600: '#8e8e8e',
    grey700: '#777777',
    grey800: '#606060',
    grey900: '#4a4a4a',
    grey1000: '#333333',
    greyAlpha10: '#33333319',
    greyAlpha50: '#3333337f',
    greyPurple: '#27212C',
    greyBlue: '#0F1C28',

    // Red
    red100: '#f9e3dc',
    red200: '#f2c6b9',
    red300: '#c7522a',
    red400: '#ad4623',
    red500: '#722c14',
    red600: '#4c1a0a',
    redAlpha10: '#f9e3dc19',
    redAlpha50: '#f9e3dc7f',

    // Aquamarine
    aqua100: '#7FFFF7',
    aqua200: '#40FFF3',
    aqua300: '#00FFEF',
    aqua400: '#00BFB3',
    aqua500: '#00887F',
    aqua600: '#00514C',
    aquaAlpha10: '#00FFEF19',
    aquaAlpha50: '#00BFB37f',

    transparent: 'transparent',
    white: '#ffffff',
    black: '#000000',
}

export const semanticColors = {
    primary: primitiveColors.purple300,
    primaryLight: primitiveColors.purple100,
    primaryDark: primitiveColors.purple600,

    secondary: primitiveColors.blue300,
    secondaryLight: primitiveColors.blue100,
    secondaryDark: primitiveColors.blue600,

    error: primitiveColors.red300,
    errorLight: primitiveColors.red100,
    errorDark: primitiveColors.red600,

    success: primitiveColors.aqua300,
    successLight: primitiveColors.aqua100,
    successDark: primitiveColors.aqua600,

    warning: primitiveColors.yellow300,
    warningLight: primitiveColors.yellow100,
    warningDark: primitiveColors.yellow600,

    textPrimary: primitiveColors.greyPurple,
    textSecondary: primitiveColors.grey800,
}

// Function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};


// Predefined shadows
export const shadows = {
    small: {
      shadowColor: primitiveColors.greyPurple,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: primitiveColors.greyPurple,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: primitiveColors.greyPurple,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  };

  const colors = {
    ...semanticColors,
    primitive: primitiveColors,
    shadows,
    utils: {
      withOpacity,
    },
  };
  
  export default colors;