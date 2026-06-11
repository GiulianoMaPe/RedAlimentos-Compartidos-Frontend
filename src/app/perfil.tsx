import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const cerrarSesion = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={64} color="#fff" />
      </View>
      <Text style={styles.title}>Gestor Comedor Demo</Text>
      <Text style={styles.subtitle}>comedor.demo@redalimentos.local</Text>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={22} color="#d32f2f" style={{ marginRight: 10 }} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  separator: { height: 1, backgroundColor: '#ddd', width: '100%', marginBottom: 30 },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  logoutText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold' },
});
