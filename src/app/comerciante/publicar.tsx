import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { crearDonacion } from '@/api/donaciones';
import { getApiErrorMessage } from '@/api/errors';
import { DEFAULT_PUESTO_ID } from '@/constants/config';

export default function PublicarDonacion() {
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [publicando, setPublicando] = useState(false);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const manejarPublicacion = async () => {
    const descripcionTrim = descripcion.trim();
    const cantidadNum = parseFloat(cantidad);

    if (!descripcionTrim) {
      mostrarNotificacion('La descripción es obligatoria', 'error');
      return;
    }

    if (!cantidadNum || cantidadNum <= 0) {
      mostrarNotificacion('Ingresa una cantidad válida en kg', 'error');
      return;
    }

    setPublicando(true);
    try {
      await crearDonacion({
        puesto_id: DEFAULT_PUESTO_ID,
        descripcion: descripcionTrim,
        cantidad_kg: cantidadNum,
      });
      mostrarNotificacion('Lote publicado exitosamente', 'success');
      setDescripcion('');
      setCantidad('');
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setPublicando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Registrar Lote Excedente</Text>
        <Text style={styles.subtitle}>Completa los datos del lote que deseas donar</Text>

        <Text style={styles.inputLabel}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 10 kg de Plátanos maduros"
          placeholderTextColor="#999"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <Text style={styles.inputLabel}>Cantidad (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 10"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={cantidad}
          onChangeText={setCantidad}
        />

        <TouchableOpacity
          style={[styles.button, publicando && styles.buttonDisabled]}
          onPress={() => void manejarPublicacion()}
          disabled={publicando}>
          <Ionicons name="cloud-upload" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{publicando ? 'Publicando...' : 'Publicar Lote'}</Text>
        </TouchableOpacity>
      </View>

      {toast.visible && (
        <View style={[styles.toast, toast.tipo === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Ionicons
            name={toast.tipo === 'error' ? 'close-circle' : 'checkmark-circle'}
            size={24}
            color={toast.tipo === 'error' ? '#fff' : '#81c784'}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.toastText}>{toast.mensaje}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    minHeight: 50,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  toast: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '85%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastSuccess: { backgroundColor: '#333333' },
  toastError: { backgroundColor: '#d32f2f' },
  toastText: { color: '#fff', fontSize: 15, fontWeight: '600', maxWidth: '90%' },
});
