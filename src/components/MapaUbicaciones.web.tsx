import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MapaUbicaciones() {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>El mapa no está disponible en la versión web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: 20 },
  message: { color: '#666', fontSize: 16, textAlign: 'center' },
});
