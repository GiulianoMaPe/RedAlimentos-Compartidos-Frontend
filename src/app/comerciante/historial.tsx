import { useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { listarDonacionesPorPuesto } from '@/api/donaciones';
import { getApiErrorMessage } from '@/api/errors';
import { Donacion } from '@/api/types';
import { useSession } from '@/context/SessionContext';

export default function HistorialScreen() {
  const { usuario } = useSession();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const cargarHistorial = useCallback(async () => {
    if (!usuario?.puesto_id) return;
    setLoading(true);
    try {
      setDonaciones(await listarDonacionesPorPuesto(usuario.puesto_id));
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      if (usuario?.puesto_id) {
        void cargarHistorial();
      }
    }, [usuario?.puesto_id])
  );

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'Disponible': return '#2e7d32';
      case 'Reservado': return '#f57f17';
      case 'Recogido': return '#1565c0';
      default: return '#666';
    }
  };

  const renderDonacion = ({ item }: { item: Donacion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Lote #{item.id}</Text>
        <View style={[styles.badge, { backgroundColor: estadoColor(item.estado) }]}>
          <Text style={styles.badgeText}>{item.estado}</Text>
        </View>
      </View>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <Text style={styles.cardKg}>{item.cantidad_kg} kg</Text>
    </View>
  );

  if (!usuario?.puesto_id) {
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
          onRefresh={() => void cargarHistorial()}
          refreshing={loading}
          ListEmptyComponent={<Text style={styles.emptyText}>No has publicado lotes aún</Text>}
        />
      )}

      {toast.visible && (
        <View style={[styles.toast, toast.tipo === 'error' ? styles.toastError : styles.toastSuccess]}>
          <MaterialIcons
            name={toast.tipo === 'error' ? 'cancel' : 'check-circle'}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 14, color: '#666' },
  badge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  cardKg: { fontSize: 14, color: '#2e7d32', fontWeight: '600' },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastSuccess: { backgroundColor: '#333333' },
  toastError: { backgroundColor: '#d32f2f' },
  toastText: { color: '#fff', fontSize: 15, fontWeight: '600', maxWidth: '90%' },
});
