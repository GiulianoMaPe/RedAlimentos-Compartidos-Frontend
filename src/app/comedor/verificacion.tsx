import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function VerificacionScreen() {
  const { codigo, idReserva } = useLocalSearchParams<{ codigo: string; idReserva: string }>();

  if (!codigo) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Ionicons name="warning" size={40} color="#d32f2f" style={styles.errorIcon} />
          <Text style={styles.errorText}>
            No se pudo generar el código, contacta soporte
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/comedor/feed')}>
            <Text style={styles.buttonText}>Volver al Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.tituloRow}>
          <Ionicons name="checkmark-circle" size={26} color="#2e7d32" style={{ marginRight: 6 }} />
          <Text style={styles.titulo}>¡Reserva Exitosa!</Text>
        </View>
        <Text style={styles.subtitulo}>Reserva #{idReserva}</Text>

        <View style={styles.qrContainer}>
          <QRCode value={codigo} size={220} />
        </View>

        <Text style={styles.labelCodigo}>Tu código de recojo:</Text>
        <View style={styles.pinContainer}>
          <Text style={styles.pin}>{codigo}</Text>
        </View>

        <Text style={styles.instruccion}>
          Muestra este código al comerciante al recoger tu donación.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/comedor/feed')}>
          <Text style={styles.buttonText}>Volver al Feed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  labelCodigo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontWeight: '600',
  },
  pinContainer: {
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  pin: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#2e7d32',
    letterSpacing: 8,
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }),
  },
  instruccion: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorCard: {
    margin: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});
