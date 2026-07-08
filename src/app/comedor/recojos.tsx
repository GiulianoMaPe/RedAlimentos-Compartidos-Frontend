import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { getApiErrorMessage } from '@/api/errors';
import { confirmarEstadoReserva, listarReservasPendientes } from '@/api/reservas';
import { ReservaPendiente, ResultadoReserva } from '@/api/types';
import { useSession } from '@/context/SessionContext';
import { confirmarAccion } from '@/utils/confirmar';

export default function RecojosScreen() {
  const { usuario } = useSession();
  const [pendientes, setPendientes] = useState<ReservaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState<Record<number, string>>({});
  const [calificandoId, setCalificandoId] = useState<number | null>(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });
  const [modalQR, setModalQR] = useState({ visible: false, codigo: '', idReserva: 0 });

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

  const ejecutarConfirmacion = async (
    idReserva: number,
    resultado: ResultadoReserva,
    puntaje?: number,
    comentario?: string,
  ) => {
    setCalificandoId(idReserva);
    try {
      const response = await confirmarEstadoReserva(idReserva, resultado, puntaje, comentario);
      mostrarNotificacion(response.mensaje, 'success');
      await cargarPendientes();
      setComentarios((prev) => {
        const { [idReserva]: _omitido, ...resto } = prev;
        return resto;
      });
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setCalificandoId(null);
    }
  };

  const calificarEntrega = (idReserva: number, puntaje: number) => {
    const comentario = (comentarios[idReserva] ?? '').trim();
    if (!comentario) {
      mostrarNotificacion('Debes escribir un comentario antes de calificar', 'error');
      return;
    }
    void ejecutarConfirmacion(idReserva, 'Entregado', puntaje, comentario);
  };

  const rechazarDonativo = (idReserva: number) => {
    const comentario = (comentarios[idReserva] ?? '').trim();
    if (!comentario) {
      mostrarNotificacion('Escribe un comentario explicando el rechazo', 'error');
      return;
    }
    confirmarAccion({
      titulo: 'Rechazar donativo',
      mensaje: '¿Confirmas el rechazo? Se registrará con 0 estrellas y no se contabilizará CO₂.',
      textoConfirmar: 'Rechazar',
      destructivo: true,
      onConfirmar: () => void ejecutarConfirmacion(idReserva, 'Rechazado', undefined, comentario),
    });
  };

  const cancelarReserva = (idReserva: number) => {
    confirmarAccion({
      titulo: 'Cancelar reserva',
      mensaje: '¿Seguro que deseas cancelar esta reserva? El lote volverá a estar disponible.',
      textoConfirmar: 'Cancelar reserva',
      destructivo: true,
      onConfirmar: () => void ejecutarConfirmacion(idReserva, 'Cancelado'),
    });
  };

  const renderPendiente = ({ item }: { item: ReservaPendiente }) => {
    const comentarioActual = comentarios[item.id_reserva] ?? '';
    const enProceso = calificandoId === item.id_reserva;
    const validado = item.estado === 'Validado';
    const rechazoDeshabilitado = enProceso || comentarioActual.trim() === '';

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reserva #{item.id_reserva}</Text>
        <Text style={styles.cardDesc}>{item.descripcion}</Text>

        <View style={styles.statusRow}>
          <Ionicons
            name={validado ? 'checkmark-circle' : 'hourglass-outline'}
            size={18}
            color={validado ? '#2e7d32' : '#f57f17'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.statusText, { color: validado ? '#2e7d32' : '#f57f17' }]}>
            {validado ? 'Validado — califica la entrega' : 'Esperando validación del comerciante'}
          </Text>
        </View>

        {!validado && item.codigo_verificacion && (
          <TouchableOpacity
            style={styles.verCodigoBtn}
            onPress={() => setModalQR({ visible: true, codigo: item.codigo_verificacion, idReserva: item.id_reserva })}>
            <Ionicons name="qr-code-outline" size={18} color="#2e7d32" style={{ marginRight: 6 }} />
            <Text style={styles.verCodigoBtnText}>Ver código de recojo</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.commentInput}
          placeholder="Escribe un comentario sobre la entrega..."
          placeholderTextColor="#999"
          value={comentarioActual}
          onChangeText={(text) =>
            setComentarios((prev) => ({ ...prev, [item.id_reserva]: text }))
          }
          multiline
          editable={!enProceso}
        />

        <Text style={styles.instructionText}>¿Ya lo recogiste? Califica la frescura:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((estrella) => {
            const deshabilitado = !validado || comentarioActual.trim() === '' || enProceso;
            return (
              <TouchableOpacity
                key={estrella}
                style={[styles.starButton, deshabilitado && styles.starButtonDisabled]}
                onPress={() => calificarEntrega(item.id_reserva, estrella)}
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

        <View style={styles.actionsRow}>
          {validado && (
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton, rechazoDeshabilitado && styles.actionButtonDisabled]}
              onPress={() => rechazarDonativo(item.id_reserva)}
              disabled={rechazoDeshabilitado}>
              <Ionicons name="close-circle" size={18} color="#d32f2f" style={{ marginRight: 6 }} />
              <Text style={styles.rejectButtonText}>Rechazar donativo (0 estrellas)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton, enProceso && styles.actionButtonDisabled]}
            onPress={() => cancelarReserva(item.id_reserva)}
            disabled={enProceso}>
            <Ionicons name="ban-outline" size={18} color="#555" style={{ marginRight: 6 }} />
            <Text style={styles.cancelButtonText}>Cancelar reserva</Text>
          </TouchableOpacity>
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

      <Modal visible={modalQR.visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Código de Recojo</Text>
                <TouchableOpacity onPress={() => setModalQR({ ...modalQR, visible: false })}>
                  <Ionicons name="close" size={28} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>Reserva #{modalQR.idReserva}</Text>

              <View style={styles.qrContainer}>
                <QRCode value={modalQR.codigo} size={220} />
              </View>

              <Text style={styles.labelCodigo}>Tu código PIN:</Text>
              <View style={styles.pinContainer}>
                <Text style={styles.pin}>{modalQR.codigo}</Text>
              </View>

              <Text style={styles.instruccion}>
                Muestra este código QR o PIN al comerciante para validar tu recojo.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalQR({ ...modalQR, visible: false })}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusText: { fontSize: 14, fontWeight: '600' },
  actionsRow: { marginTop: 14, gap: 10 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonDisabled: { opacity: 0.5 },
  rejectButton: { backgroundColor: '#fdecea', borderColor: '#d32f2f' },
  rejectButtonText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },
  cancelButton: { backgroundColor: '#f5f5f5', borderColor: '#bbb' },
  cancelButtonText: { color: '#555', fontWeight: 'bold', fontSize: 14 },
  verCodigoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a5d6a7',
    marginBottom: 10,
  },
  verCodigoBtnText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 6 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalSubtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  qrContainer: { padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 24 },
  labelCodigo: { fontSize: 16, color: '#555', marginBottom: 10, fontWeight: '600' },
  pinContainer: { backgroundColor: '#f0f2f5', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 28, marginBottom: 20, borderWidth: 2, borderColor: '#2e7d32' },
  pin: { fontSize: 44, fontWeight: 'bold', color: '#2e7d32', letterSpacing: 8, fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }) },
  instruccion: { fontSize: 14, color: '#777', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  modalButton: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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
