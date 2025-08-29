import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      marginTop: 16,
    },
    mapContainer: {
      height: 280,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
    },
    map3DEffect: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 30,
      backgroundColor: 'rgba(0,0,0,0.05)',
      transform: [{ skewY: '5deg' }],
    },
    markerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#A78BFA',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    markerText: {
      fontSize: 20,
    },
    addressText: {
      marginTop: 12,
      fontSize: 14,
      color: '#64748B',
      lineHeight: 20,
    },
  });