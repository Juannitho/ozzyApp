import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { styles } from './MeetingPointMap.style';

interface MeetingPointMapProps {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
}

const { width } = Dimensions.get('window');
const ASPECT_RATIO = width / 200; // Altura del mapa
const LATITUDE_DELTA = 0.002; // Zoom del mapa
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const MeetingPointMap: React.FC<MeetingPointMapProps> = ({
    latitude,
    longitude,
    address,
    placeName,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    <Marker
                        coordinate={{ latitude, longitude }}
                        title={placeName || 'Meeting Point'}
                        description={address}
                        tracksViewChanges={false}
                    >
                        {/* Custom marker */}
                        <View style={styles.markerContainer}>
                            <View style={styles.markerCircle}>
                                <Text style={styles.markerText}>📍</Text>
                            </View>
                        </View>
                    </Marker>
                </MapView>

                {/* Overlay with 3D effect */}
                <View style={styles.mapOverlay} pointerEvents="none">
                    <View style={styles.map3DEffect} />
                </View>
            </View>

            <Text style={styles.addressText}>{address}</Text>
        </View>
    );
};