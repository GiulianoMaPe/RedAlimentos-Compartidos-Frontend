import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // <-- Nueva librería para QR
//import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { listarDonacionesPorPuesto } from '@/api/donaciones';
import { getApiErrorMessage } from '@/api/errors';
import { Donacion } from '@/api/types';
import { useSession } from '@/context/SessionContext';

export default function HistorialScreen() {
  const { usuario } = useSession();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  // --- ESTADOS NUEVOS TAREA 12 ---
  const [modalVisible, setModalVisible] = useState(false);
  const [loteSeleccionado, setLoteSeleccionado] = useState<number | null>(null);
  const [modoEscaneo, setModoEscaneo] = useState(false);
  const [pinManual, setPinManual] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

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

  // Abrir la ventana para validar un lote específico
  const abrirValidador = (idLote: number) => {
    setLoteSeleccionado(idLote);
    setPinManual('');
    setModoEscaneo(false);
    setModalVisible(true);
  };

  // 1. Lógica para manejar el escaneo del Código QR
  const manejarEscaneoQR = ({ data }: { data: string }) => {
    setModoEscaneo(false);
    setModalVisible(false);
    
    // Aquí simulamos el envío del código QR detectado a la API
    Alert.alert(
      "Validación Exitosa", 
      `Código QR válido para el Lote #${loteSeleccionado}. Contenido: ${data}`,
      [{ text: "Ok", onPress: () => void cargarHistorial() }]
    );
  };

  // 2. Lógica para enviar el PIN manual escrito
  const manejarValidacionPIN = () => {
    if (pinManual.trim().length < 4) {
      mostrarNotificacion('Ingresa un PIN válido', 'error');
      return;
    }

    setModalVisible(false);
    // Aquí se enviaría el PIN ingresado a la API
    Alert.alert(
      "Validación con PIN exitosa", 
      `El Lote #${loteSeleccionado} fue marcado como Recogido correctamente.`,
      [{ text: "Ok", onPress: () => void cargarHistorial() }]
    );
  };

  // Activar la cámara pidiendo permisos si no los tiene
  const iniciarEscaneo = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        mostrarNotificacion('Se necesita permiso de cámara para escanear', 'error');
        return;
      }
    }
    setModoEscaneo(true);
  };

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

      {/* --- BOTÓN NUEVO: APARECE SÓLO SI EL LOTE ESTÁ RESERVADO --- */}
      {item.estado === 'Reservado' && (
        <TouchableOpacity style={styles.validateButton} onPress={() => abrirValidador(item.id)}>
          <Ionicons name="qr-code-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.validateButtonText}>Validar Recojo</Text>
        </TouchableOpacity>
      )}
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

      {/* --- MODAL DE VALIDACIÓN (QR / PIN MANUAL) --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalCentered}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Validar Entrega - Lote #{loteSeleccionado}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {modoEscaneo ? (
              /* PANEL DE LA CÁMARA QR */
              <View style={styles.cameraWrapper}>
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={manejarEscaneoQR}
                />
                <TouchableOpacity style={styles.cancelCameraBtn} onPress={() => setModoEscaneo(false)}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Regresar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* OPCIONES DE PIN MANUAL Y BOTÓN DE ENTRADA A CÁMARA */
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity style={styles.scanSelector} onPress={iniciarEscaneo}>
                  <Ionicons name="camera" size={32} color="#2e7d32" />
                  <Text style={styles.scanSelectorText}>Escanear Código QR del Comedor</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.pinLabel}>O ingresa el PIN manual de validación</Text>
                <TextInput
                  style={styles.pinInput}
                  placeholder="Ej. 1234"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pinManual}
                  onChangeText={setPinManual}
                />

                <TouchableOpacity style={styles.submitPinBtn} onPress={manejarValidacionPIN}>
                  <Text style={styles.submitPinText}>Confirmar PIN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

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
  validateButton: {
    flexDirection: 'row',
    backgroundColor: '#f57f17',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  validateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 },
  
  // ESTILOS NUEVOS MODAL Y CÁMARA
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { backgroundColor: '#fff', width: '90%', borderRadius: 12, padding: 20, alignItems: 'center', elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  scanSelector: { flexDirection: 'column', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: '#a5d6a7', borderRadius: 8, backgroundColor: '#e8f5e9', width: '100%', marginBottom: 15 },
  scanSelectorText: { color: '#2e7d32', fontWeight: 'bold', marginTop: 8, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#ddd', width: '100%', marginVertical: 10 },
  pinLabel: { fontSize: 14, color: '#555', marginBottom: 10, marginTop: 5 },
  pinInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 18, letterSpacing: 4, textAlign: 'center', width: '60%', marginBottom: 15, color: '#333' },
  submitPinBtn: { backgroundColor: '#2e7d32', paddingVertical: 12, borderRadius: 8, width: '100%', alignItems: 'center' },
  submitPinText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cameraWrapper: { width: '100%', height: 280, borderRadius: 8, overflow: 'hidden', justifyContent: 'flex-end' },
  cancelCameraBtn: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, alignItems: 'center', margin: 15, borderRadius: 8 },

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