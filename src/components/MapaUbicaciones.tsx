import { useFocusEffect } from 'expo-router';
import { GoogleMaps } from 'expo-maps';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/errors';
import { listarComedores, listarPuestos } from '@/api/ubicaciones';
import { UbicacionMapa } from '@/api/types';

const REGION_LIMA = {
  latitude: -12.0464,
  longitude: -77.0428,
};

export default function MapaUbicaciones() {
  const [ubicaciones, setUbicaciones] = useState<UbicacionMapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarUbicaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [puestos, comedores] = await Promise.all([listarPuestos(), listarComedores()]);
      setUbicaciones([...puestos, ...comedores]);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargarUbicaciones();
    }, [cargarUbicaciones])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <GoogleMaps.View
      style={styles.map}
      cameraPosition={{
        coordinates: REGION_LIMA,
        zoom: 13,
      }}
      markers={ubicaciones.map((u) => ({
        id: `${u.tipo}-${u.id}`,
        coordinates: { latitude: u.latitud, longitude: u.longitud },
        title: u.nombre,
        snippet: u.tipo === 'puesto' ? 'Puesto de mercado' : 'Comedor',
      }))}
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: 20 },
  message: { color: '#666', fontSize: 16, textAlign: 'center' },
});
