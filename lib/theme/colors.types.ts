// Types for the color system

export interface ColorPalette {
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    
    // States
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // Texts
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textDisabled: string;
    textInverse: string;

  }
  
  export interface Shadow {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  }