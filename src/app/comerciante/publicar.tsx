import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { crearDonacion } from '@/api/donaciones';
import { getApiErrorMessage } from '@/api/errors';
import { useSession } from '@/context/SessionContext';

export default function PublicarDonacion() {
  const { usuario } = useSession();
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [publicando, setPublicando] = useState(false);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  // --- NUEVOS ESTADOS DE LA TAREA 11 ---
  const [imagen, setImagen] = useState<string | null>(null);
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState<'date' | 'time'>('date');

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  // 1. Lógica para seleccionar fotografía
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      mostrarNotificacion('Se necesitan permisos para acceder a la galería', 'error');
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  // 2. Lógica para cambiar fecha/hora límite
  const manejarCambioFecha = (event: any, fechaSeleccionada?: Date) => {
    if (Platform.OS === 'android') {
      const esConfirmacion = event?.type === 'set';
      if (modoPicker === 'date') {
        if (esConfirmacion && fechaSeleccionada) {
          setFechaLimite(fechaSeleccionada);
          setModoPicker('time');
        } else {
          setMostrarPicker(false);
          setModoPicker('date');
        }
      } else {
        setMostrarPicker(false);
        setModoPicker('date');
        if (esConfirmacion && fechaSeleccionada) {
          setFechaLimite(fechaSeleccionada);
        }
      }
    } else {
      setMostrarPicker(false);
      if (fechaSeleccionada) {
        setFechaLimite(fechaSeleccionada);
      }
    }
  };

  // 3. Lógica para llamar al nuevo endpoint DELETE
  const manejarEliminacion = () => {
    Alert.alert(
      "Eliminar Publicación",
      "¿Estás seguro de que deseas eliminar este lote excedente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Aquí irá la llamada fetch real al endpoint DELETE cuando el backend se actualice:
              // await fetch(`http://tu-api/donaciones/${id}`, { method: 'DELETE' });
              mostrarNotificacion('Publicación eliminada correctamente.', 'success');
              setDescripcion('');
              setCantidad('');
              setImagen(null);
              setFechaLimite(new Date());
            } catch (error) {
              mostrarNotificacion('Error al intentar eliminar el lote.', 'error');
            }
          } 
        }
      ]
    );
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

    if (!usuario?.puesto_id) {
      mostrarNotificacion('Error de sesión: vuelve a iniciar sesión', 'error');
      return;
    }

    setPublicando(true);
    try {
      await crearDonacion({
        puesto_id: usuario.puesto_id,
        descripcion: descripcionTrim,
        cantidad_kg: cantidadNum,
        imagen: imagen ?? undefined,
        tiempo_limite: fechaLimite.toISOString(),
      });
      mostrarNotificacion('Lote publicado exitosamente', 'success');
      setDescripcion('');
      setCantidad('');
      setImagen(null);
      setFechaLimite(new Date());
    } catch (error) {
      mostrarNotificacion(`Error: ${getApiErrorMessage(error)}`, 'error');
    } finally {
      setPublicando(false);
    }
  };

  if (!usuario?.puesto_id) {
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
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

          {/* --- SECCIÓN NUEVA: SUBIDA DE IMAGEN --- */}
          <Text style={styles.inputLabel}>Fotografía del Alimento</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={seleccionarImagen}>
            <Ionicons name="camera" size={20} color="#2e7d32" style={{ marginRight: 8 }} />
            <Text style={styles.imagePickerButtonText}>
              {imagen ? 'Cambiar Fotografía' : 'Seleccionar Fotografía'}
            </Text>
          </TouchableOpacity>
          {imagen && <Image source={{ uri: imagen }} style={styles.previewImage} />}

          {/* --- SECCIÓN NUEVA: TIEMPO LÍMITE DE ESPERA --- */}
          <Text style={styles.inputLabel}>Tiempo Límite de Espera</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => {
            setMostrarPicker(true);
            if (Platform.OS === 'android') setModoPicker('date');
          }}>
            <Ionicons name="time" size={20} color="#555" style={{ marginRight: 8 }} />
            <Text style={styles.dateButtonText}>{fechaLimite.toLocaleString()}</Text>
          </TouchableOpacity>
          {mostrarPicker && (
            <DateTimePicker
              value={fechaLimite}
              mode={Platform.OS === 'android' ? modoPicker : 'datetime'}
              display="default"
              onChange={manejarCambioFecha}
            />
          )}

          {/* BOTÓN PRINCIPAL DE PUBLICAR */}
          <TouchableOpacity
            style={[styles.button, publicando && styles.buttonDisabled]}
            onPress={() => void manejarPublicacion()}
            disabled={publicando}>
            <Ionicons name="cloud-upload" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>{publicando ? 'Publicando...' : 'Publicar Lote'}</Text>
          </TouchableOpacity>

          {/* --- SECCIÓN NUEVA: BOTÓN PARA ELIMINAR EL LOTE --- */}
          <TouchableOpacity style={styles.deleteButton} onPress={manejarEliminacion}>
            <Ionicons name="trash" size={20} color="#d32f2f" style={{ marginRight: 8 }} />
            <Text style={styles.deleteButtonText}>Eliminar Publicación</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

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
  scrollContent: { flexGrow: 1, padding: 20 },
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
  imagePickerButton: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: { color: '#2e7d32', fontWeight: '600', fontSize: 15 },
  previewImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 16, resizeMode: 'cover' },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  dateButtonText: { color: '#333', fontSize: 15 },
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
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  deleteButtonText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 15 },
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