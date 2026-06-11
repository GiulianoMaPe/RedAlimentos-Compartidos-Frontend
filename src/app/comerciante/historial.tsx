import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HistorialScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="history" size={64} color="#ccc" />
      <Text style={styles.title}>Historial de Publicaciones</Text>
      <Text style={styles.subtitle}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15 },
  subtitle: { fontSize: 16, color: '#999', marginTop: 5 },
});
