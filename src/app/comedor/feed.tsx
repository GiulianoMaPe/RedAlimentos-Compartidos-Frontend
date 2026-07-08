import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { listarDonaciones } from '@/api/donaciones';
import { getApiErrorMessage } from '@/api/errors';
import { reservarDonacion } from '@/api/reservas';
import { Donacion } from '@/api/types';
import { useSession } from '@/context/SessionContext';

export default function FeedScreen() {
  const { usuario } = useSession();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const cargarDonaciones = useCallback(async () => {
    setLoading(true);
    try {
      setDonaciones(await listarDonaciones());
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (usuario?.comedor_id) {
        void cargarDonaciones();
      }
    }, [usuario?.comedor_id])
  );

  const reservarLote = async (idDonacion: number) => {
    if (!usuario?.comedor_id) {
      mostrarNotificacion('Error de sesión: vuelve a iniciar sesión', 'error');
      return;
    }
    try {
      const response = await reservarDonacion(idDonacion, usuario.comedor_id);
      await cargarDonaciones();
      router.push({
        pathname: '/comedor/verificacion',
        params: {
          codigo: response.codigo_verificacion,
          idReserva: response.id_reserva.toString(),
        },
      });
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    }
  };

  const renderDonacion = ({ item }: { item: Donacion }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Lote #{item.id}</Text>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <Text style={styles.cardKg}>{item.cantidad_kg} kg</Text>
      <TouchableOpacity style={styles.button} onPress={() => void reservarLote(item.id)}>
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  if (!usuario?.comedor_id) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={donaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDonacion}
          onRefresh={() => void cargarDonaciones()}
          refreshing={loading}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay donaciones disponibles</Text>}
        />
      )}

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
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  cardKg: { fontSize: 14, color: '#2e7d32', fontWeight: '600', marginBottom: 10 },
  button: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 },
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
