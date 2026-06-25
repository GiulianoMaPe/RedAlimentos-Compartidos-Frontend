import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getApiErrorMessage } from '@/api/errors';
import { confirmarRecojo, listarReservasPendientes } from '@/api/reservas';
import { ReservaPendiente } from '@/api/types';
import { useSession } from '@/context/SessionContext';

export default function RecojosScreen() {
  const { usuario } = useSession();
  const [pendientes, setPendientes] = useState<ReservaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState<Record<number, string>>({});
  const [calificandoId, setCalificandoId] = useState<number | null>(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const cargarPendientes = useCallback(async () => {
    setLoading(true);
    try {
      if (!usuario?.comedor_id) {
        mostrarNotificacion('Error de sesión: vuelve a iniciar sesión', 'error');
        setPendientes([]);
        return;
      }
      setPendientes(await listarReservasPendientes(usuario.comedor_id));
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      if (usuario?.comedor_id) {
        void cargarPendientes();
      }
    }, [usuario?.comedor_id])
  );

  const calificarRecojo = async (idReserva: number, puntaje: number) => {
    const comentario = (comentarios[idReserva] ?? '').trim();
    if (!comentario) {
      mostrarNotificacion('Debes escribir un comentario antes de calificar', 'error');
      return;
    }

    setCalificandoId(idReserva);
    try {
      const response = await confirmarRecojo(idReserva, puntaje, comentario);
      mostrarNotificacion(response.impacto, 'success');
      await cargarPendientes();
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setCalificandoId(null);
    }
  };

  const renderPendiente = ({ item }: { item: ReservaPendiente }) => {
    const comentarioActual = comentarios[item.id_reserva] ?? '';

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reserva #{item.id_reserva}</Text>
        <Text style={styles.cardDesc}>{item.descripcion}</Text>

        <TextInput
          style={styles.commentInput}
          placeholder="Escribe un comentario sobre la entrega..."
          placeholderTextColor="#999"
          value={comentarioActual}
          onChangeText={(text) =>
            setComentarios((prev) => ({ ...prev, [item.id_reserva]: text }))
          }
          multiline
        />

        <Text style={styles.instructionText}>¿Ya lo recogiste? Califica la frescura:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((estrella) => {
            const deshabilitado = comentarioActual.trim() === '' || calificandoId === item.id_reserva;
            return (
              <TouchableOpacity
                key={estrella}
                style={[styles.starButton, deshabilitado && styles.starButtonDisabled]}
                onPress={() => void calificarRecojo(item.id_reserva, estrella)}
                disabled={deshabilitado}>
                <Text style={[styles.starText, deshabilitado && styles.starTextDisabled]}>
                  {estrella}
                </Text>
                <Ionicons
                  name="star"
                  size={16}
                  color={deshabilitado ? '#ccc' : '#f57f17'}
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (!usuario?.comedor_id) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pendientes}
          keyExtractor={(item) => item.id_reserva.toString()}
          renderItem={renderPendiente}
          onRefresh={() => void cargarPendientes()}
          refreshing={loading}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes recojos pendientes</Text>}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  instructionText: { color: '#555', marginBottom: 10, fontStyle: 'italic' },
  starsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  starButton: {
    flexDirection: 'row',
    backgroundColor: '#fff9c4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbc02d',
    alignItems: 'center',
  },
  starButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  starText: { fontSize: 16, fontWeight: 'bold', color: '#f57f17' },
  starTextDisabled: { color: '#ccc' },
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
