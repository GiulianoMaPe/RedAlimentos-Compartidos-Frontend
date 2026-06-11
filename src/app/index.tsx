import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={48} color="#2e7d32" />
        <Text style={styles.title}>Red de Alimentos</Text>
        <Text style={styles.subtitle}>Compartidos</Text>
      </View>

      <Text style={styles.label}>¿Qué rol deseas usar?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/comedor/feed')}>
        <Ionicons name="restaurant" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Soy Comedor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonOutline]}
        onPress={() => router.replace('/comerciante/publicar')}>
        <Ionicons name="storefront" size={24} color="#2e7d32" style={{ marginRight: 10 }} />
        <Text style={[styles.buttonText, styles.buttonTextOutline]}>Soy Comerciante</Text>
      </TouchableOpacity>
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
  header: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginTop: 10 },
  subtitle: { fontSize: 20, color: '#558b2f', fontWeight: '300' },
  label: { fontSize: 16, color: '#666', marginBottom: 25 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
    elevation: 3,
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonTextOutline: { color: '#2e7d32' },
});
