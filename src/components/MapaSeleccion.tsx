import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const REGION_LIMA = {
  latitude: -12.0464,
  longitude: -77.0428,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

interface Props {
  coordenadas: { latitude: number; longitude: number };
  onDragEnd: (coords: { latitude: number; longitude: number }) => void;
  altura?: number;
}

export default function MapaSeleccion({ coordenadas, onDragEnd, altura = 220 }: Props) {
  const mapRef = useRef<MapView>(null);

  return (
    <View style={[styles.container, { height: altura }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...REGION_LIMA,
          latitude: coordenadas.latitude || REGION_LIMA.latitude,
          longitude: coordenadas.longitude || REGION_LIMA.longitude,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}>
        <Marker
          coordinate={{
            latitude: coordenadas.latitude || REGION_LIMA.latitude,
            longitude: coordenadas.longitude || REGION_LIMA.longitude,
          }}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            onDragEnd({ latitude, longitude });
          }}
          pinColor="#d32f2f"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D3DCD0',
  },
  map: {
    flex: 1,
  },
});
