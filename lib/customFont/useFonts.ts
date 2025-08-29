import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export const useCustomFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          // Fuentes Satoshi
          'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.ttf'),
          'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium.ttf'),
          'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.ttf'),
          'Satoshi-Black': require('@/assets/fonts/Satoshi-Black.ttf'),
          
          // Fuentes Clash Display
          'ClashDisplay-Regular': require('@/assets/fonts/ClashDisplay-Regular.ttf'),
          'ClashDisplay-Medium': require('@/assets/fonts/ClashDisplay-Medium.ttf'),
          'ClashDisplay-Semibold': require('@/assets/fonts/ClashDisplay-Semibold.ttf'),
          'ClashDisplay-Bold': require('@/assets/fonts/ClashDisplay-Bold.ttf'),
        });
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error cargando fuentes:', error);
      } finally {
        // Ocultar splash screen cuando las fuentes estén cargadas
        await SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};