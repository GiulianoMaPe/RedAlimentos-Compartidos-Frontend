import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { guardarUbicacionUsuario } from '@/api/ubicaciones';
import { getApiErrorMessage } from '@/api/errors';
import { useSession } from '@/context/SessionContext';
import MapaSeleccion from '@/components/MapaSeleccion';

const DEFAULT_COORDS = { latitude: -12.0464, longitude: -77.0428 };

export default function CompletarUbicacionScreen() {
  const { usuario } = useSession();
  const [coordenadas, setCoordenadas] = useState(DEFAULT_COORDS);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });

  const coordenadasCambiadas =
    coordenadas.latitude !== DEFAULT_COORDS.latitude ||
    coordenadas.longitude !== DEFAULT_COORDS.longitude;

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const handleGuardar = async () => {
    if (!coordenadasCambiadas) {
      setError('Arrastra el marcador para fijar tu ubicación');
      return;
    }
    if (!usuario?.usuario_id) {
      setError('Error de sesión: vuelve a iniciar sesión');
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await guardarUbicacionUsuario(usuario.usuario_id, {
        latitud: coordenadas.latitude,
        longitud: coordenadas.longitude,
      });
      mostrarNotificacion('Ubicación guardada', 'success');
      const destino = usuario.rol === 'GestorComedor' ? '/comedor/feed' : '/comerciante/publicar';
      router.replace(destino);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg || 'No se pudo guardar la ubicación');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo-vertical.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Elige tu ubicación</Text>
          <Text style={styles.subtitle}>
            Arrastra el marcador rojo para fijar la ubicación exacta de tu puesto o comedor
          </Text>
        </View>

        <MapaSeleccion
          coordenadas={coordenadas}
          onDragEnd={setCoordenadas}
          altura={240}
        />

        <View style={styles.coordCard}>
          <View style={styles.coordRow}>
            <Ionicons name="locate" size={16} color="#1E5631" />
            <Text style={styles.coordLabel}>Coordenadas seleccionadas</Text>
          </View>
          <View style={styles.coordValues}>
            <View style={styles.coordItem}>
              <Text style={styles.coordKey}>Lat</Text>
              <Text style={styles.coordVal}>{coordenadas.latitude.toFixed(4)}</Text>
            </View>
            <View style={styles.coordDivider} />
            <View style={styles.coordItem}>
              <Text style={styles.coordKey}>Lng</Text>
              <Text style={styles.coordVal}>{coordenadas.longitude.toFixed(4)}</Text>
            </View>
          </View>
          {!coordenadasCambiadas && (
            <View style={styles.hintRow}>
              <Ionicons name="information-circle-outline" size={14} color="#888" />
              <Text style={styles.hintText}>Mueve el pin del mapa para cambiar</Text>
            </View>
          )}
        </View>

        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="close-circle" size={18} color="#B3261E" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, (guardando || !coordenadasCambiadas) && styles.buttonDisabled]}
          onPress={() => void handleGuardar()}
          disabled={guardando || !coordenadasCambiadas}
          activeOpacity={0.8}>
          {guardando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Guardar ubicación</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {toast.visible && (
        <View style={[styles.toast, toast.tipo === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Ionicons
            name={toast.tipo === 'error' ? 'close-circle' : 'checkmark-circle'}
            size={22}
            color="#fff"
          />
          <Text style={styles.toastText}>{toast.mensaje}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F2',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    aspectRatio: 669 / 373,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#131A12',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A6657',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  coordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D3DCD0',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  coordLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A6657',
  },
  coordValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordKey: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coordVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E5631',
    marginTop: 2,
  },
  coordDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#D3DCD0',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  errorText: {
    color: '#B3261E',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E5631',
    height: 52,
    borderRadius: 999,
    marginTop: 20,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
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
    gap: 10,
  },
  toastSuccess: { backgroundColor: '#333333' },
  toastError: { backgroundColor: '#d32f2f' },
  toastText: { color: '#fff', fontSize: 15, fontWeight: '600', maxWidth: '85%' },
});
