import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/errors';
import { obtenerImpacto } from '@/api/impacto';
import { ImpactoData, Trazabilidad } from '@/api/types';
import { useSession } from '@/context/SessionContext';

export default function ImpactoScreen() {
  const { usuario } = useSession();
  const [impactoData, setImpactoData] = useState<ImpactoData>({ co2_total: 0, historial: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const cargarImpacto = useCallback(async () => {
    setLoading(true);
    try {
      if (!usuario?.comedor_id) {
        mostrarNotificacion('Error de sesión: vuelve a iniciar sesión', 'error');
        setImpactoData({ co2_total: 0, historial: [] });
        return;
      }
      setImpactoData(await obtenerImpacto(usuario.comedor_id));
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      if (usuario?.comedor_id) {
        void cargarImpacto();
      }
    }, [usuario?.comedor_id])
  );

  const renderTrazabilidad = ({ item }: { item: Trazabilidad }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recojo del {item.fecha}</Text>
      <View style={styles.iconRow}>
        <Text style={styles.cardDesc}>Frescura: {item.frescura} / 5</Text>
        <Ionicons name="star" size={18} color="#fbc02d" style={{ marginLeft: 5, marginBottom: 10 }} />
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="leaf" size={18} color="#2e7d32" style={{ marginRight: 5 }} />
        <Text style={styles.co2Text}>Ahorro: {item.co2.toFixed(2)} kg CO2</Text>
      </View>
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
        <View style={{ flex: 1 }}>
          <View style={styles.impactHeader}>
            <Ionicons name="cloud-done" size={32} color="#2e7d32" style={{ marginBottom: 5 }} />
            <Text style={styles.impactTitle}>Huella Evitada</Text>
            <Text style={styles.impactNumber}>{impactoData.co2_total.toFixed(2)} kg</Text>
          </View>
          <FlatList
            data={impactoData.historial}
            keyExtractor={(item) => item.id_trazabilidad.toString()}
            renderItem={renderTrazabilidad}
            onRefresh={() => void cargarImpacto()}
            refreshing={loading}
            ListEmptyComponent={<Text style={styles.emptyText}>Sin historial</Text>}
          />
        </View>
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
  impactHeader: { backgroundColor: '#e8f5e9', margin: 15, padding: 20, borderRadius: 15, alignItems: 'center' },
  impactTitle: { fontSize: 16, color: '#2e7d32', fontWeight: '600' },
  impactNumber: { fontSize: 36, fontWeight: 'bold', color: '#1b5e20', marginTop: 5 },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  co2Text: { fontSize: 16, color: '#2e7d32', fontWeight: 'bold' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
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
