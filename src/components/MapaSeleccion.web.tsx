import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  coordenadas: { latitude: number; longitude: number };
  onDragEnd: (coords: { latitude: number; longitude: number }) => void;
  altura?: number;
}

export default function MapaSeleccion({ coordenadas, onDragEnd, altura = 220 }: Props) {
  const handleLatChange = (text: string) => {
    const val = parseFloat(text);
    if (!isNaN(val)) {
      onDragEnd({ latitude: val, longitude: coordenadas.longitude });
    }
  };

  const handleLngChange = (text: string) => {
    const val = parseFloat(text);
    if (!isNaN(val)) {
      onDragEnd({ latitude: coordenadas.latitude, longitude: val });
    }
  };

  return (
    <View style={[styles.container, { height: altura }]}>
      <View style={styles.placeholder}>
        <Ionicons name="map-outline" size={40} color="#aaa" />
        <Text style={styles.placeholderText}>
          El mapa interactivo solo está disponible en la app móvil.
        </Text>
        <Text style={styles.placeholderSubtext}>
          Ingresa las coordenadas manualmente:
        </Text>
      </View>
      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Latitud</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={coordenadas.latitude.toString()}
            onChangeText={handleLatChange}
            placeholder="-12.0464"
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Longitud</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={coordenadas.longitude.toString()}
            onChangeText={handleLngChange}
            placeholder="-77.0428"
            placeholderTextColor="#aaa"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D3DCD0',
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  inputsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3DCD0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
});
