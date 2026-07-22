import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

type Categoria = 'Frutas' | 'Verduras' | 'Tubérculos' | 'Otros';

const CATEGORIAS: { key: Categoria; icon: string; color: string }[] = [
  { key: 'Frutas', icon: '🍎', color: '#e53935' },
  { key: 'Verduras', icon: '🥬', color: '#43a047' },
  { key: 'Tubérculos', icon: '🥔', color: '#8d6e63' },
  { key: 'Otros', icon: '🛒', color: '#fb8c00' },
];

const STEPS_KG = [0.5, 1, 2, 5];

function formatTime(d: Date): string {
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(d: Date): string {
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function todayAt(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

function formatHoraApi(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

export default function PublicarDonacion() {
  const { usuario } = useSession();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);

  const [horarioApertura, setHorarioApertura] = useState(todayAt(6, 0));
  const [horarioCierre, setHorarioCierre] = useState(todayAt(17, 0));
  const [fechaCaducidad, setFechaCaducidad] = useState(() => {
    const d = addDays(new Date(), 3);
    d.setHours(12, 0, 0, 0);
    return d;
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<
    'apertura' | 'cierre' | 'caducidad_date' | 'caducidad_time'
  >('caducidad_date');
  const [pickerAndroidMode, setPickerAndroidMode] = useState<'date' | 'time'>('date');

  const [publicando, setPublicando] = useState(false);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' as 'success' | 'error' });

  const mostrarNotificacion = useCallback((mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  }, []);

  const cantidadNum = useMemo(() => {
    const n = parseFloat(cantidad);
    return isNaN(n) ? 0 : n;
  }, [cantidad]);

  const puedePublicar = useMemo(() => {
    return categoria !== null && descripcion.trim().length > 0 && cantidadNum > 0 && fechaCaducidad > new Date();
  }, [categoria, descripcion, cantidadNum, fechaCaducidad]);

  const errores = useMemo(() => {
    const e: string[] = [];
    if (!categoria) e.push('Selecciona una categoría');
    if (!descripcion.trim()) e.push('Escribe una descripción del lote');
    if (cantidadNum <= 0) e.push('Ingresa un peso válido');
    if (fechaCaducidad <= new Date()) e.push('La fecha de caducidad debe ser futura');
    if (horarioCierre <= horarioApertura) e.push('La hora de cierre debe ser posterior a la de apertura');
    return e;
  }, [categoria, descripcion, cantidadNum, fechaCaducidad, horarioApertura, horarioCierre]);

  const seleccionarFoto = async (usarCamara: boolean) => {
    if (usarCamara) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        mostrarNotificacion('Se necesita permiso para acceder a la cámara', 'error');
        return;
      }
      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });
      if (!resultado.canceled) {
        setImagen(resultado.assets[0].uri);
        setImagenBase64(resultado.assets[0].base64 ?? null);
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        mostrarNotificacion('Se necesita permiso para acceder a la galería', 'error');
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });
      if (!resultado.canceled) {
        setImagen(resultado.assets[0].uri);
        setImagenBase64(resultado.assets[0].base64 ?? null);
      }
    }
  };

  const abrirPicker = (target: typeof pickerTarget, androidMode?: 'date' | 'time') => {
    setPickerTarget(target);
    setPickerAndroidMode(androidMode ?? (target === 'caducidad_date' ? 'date' : 'time'));
    setPickerVisible(true);
  };

  const manejarPicker = useCallback(
    (_event: DateTimePickerEvent, fechaSeleccionada?: Date) => {
      if (Platform.OS === 'android') {
        if (_event.type === 'dismissed') {
          setPickerVisible(false);
          return;
        }
        if (!fechaSeleccionada) return;

        if (pickerTarget === 'apertura') {
          setHorarioApertura(fechaSeleccionada);
          setPickerVisible(false);
        } else if (pickerTarget === 'cierre') {
          setHorarioCierre(fechaSeleccionada);
          setPickerVisible(false);
        } else if (pickerTarget === 'caducidad_date') {
          const fusionada = new Date(
            fechaSeleccionada.getFullYear(),
            fechaSeleccionada.getMonth(),
            fechaSeleccionada.getDate(),
            fechaCaducidad.getHours(),
            fechaCaducidad.getMinutes(),
          );
          setFechaCaducidad(fusionada);
          setPickerTarget('caducidad_time');
          setPickerAndroidMode('time');
        } else if (pickerTarget === 'caducidad_time') {
          const fusionada = new Date(
            fechaCaducidad.getFullYear(),
            fechaCaducidad.getMonth(),
            fechaCaducidad.getDate(),
            fechaSeleccionada.getHours(),
            fechaSeleccionada.getMinutes(),
          );
          setFechaCaducidad(fusionada);
          setPickerVisible(false);
        }
      } else {
        if (fechaSeleccionada) {
          if (pickerTarget === 'apertura') {
            setHorarioApertura(fechaSeleccionada);
          } else if (pickerTarget === 'cierre') {
            setHorarioCierre(fechaSeleccionada);
          } else if (pickerTarget === 'caducidad_date' || pickerTarget === 'caducidad_time') {
            setFechaCaducidad(fechaSeleccionada);
          }
        }
        setPickerVisible(false);
      }
    },
    [pickerTarget, fechaCaducidad],
  );

  const getPickerValue = (): Date => {
    switch (pickerTarget) {
      case 'apertura':
        return horarioApertura;
      case 'cierre':
        return horarioCierre;
      case 'caducidad_date':
      case 'caducidad_time':
        return fechaCaducidad;
    }
  };

  const getPickerMode = (): 'date' | 'time' | 'datetime' => {
    if (Platform.OS === 'ios') {
      return pickerTarget === 'apertura' || pickerTarget === 'cierre' ? 'time' : 'datetime';
    }
    return pickerAndroidMode;
  };

  const incrementarKg = (delta: number) => {
    const actual = cantidadNum;
    const siguiente = Math.max(0, Math.round((actual + delta) * 10) / 10);
    setCantidad(siguiente > 0 ? siguiente.toString() : '');
  };

  const manejarPublicacion = async () => {
    if (!categoria) {
      mostrarNotificacion('Selecciona una categoría', 'error');
      return;
    }
    if (!descripcion.trim()) {
      mostrarNotificacion('Escribe una descripción del lote', 'error');
      return;
    }
    if (cantidadNum <= 0) {
      mostrarNotificacion('Ingresa un peso válido en kg', 'error');
      return;
    }
    if (!usuario?.puesto_id) {
      mostrarNotificacion('Error de sesión: vuelve a iniciar sesión', 'error');
      return;
    }

    setPublicando(true);
    try {
      const textoFinal = `[${categoria}] ${descripcion.trim()}`;
      await crearDonacion({
        puesto_id: usuario.puesto_id,
        descripcion: textoFinal,
        cantidad_kg: cantidadNum,
        tiempo_limite: fechaCaducidad.toISOString(),
        foto_base64: imagenBase64 ?? undefined,
        hora_inicio: formatHoraApi(horarioApertura),
        hora_fin: formatHoraApi(horarioCierre),
        fecha_hora_caducidad: fechaCaducidad.toISOString(),
      });
      mostrarNotificacion('Lote publicado exitosamente', 'success');
      setCategoria(null);
      setDescripcion('');
      setCantidad('');
      setImagen(null);
      setImagenBase64(null);
      setHorarioApertura(todayAt(6, 0));
      setHorarioCierre(todayAt(17, 0));
      const d = addDays(new Date(), 3);
      d.setHours(12, 0, 0, 0);
      setFechaCaducidad(d);
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* ── 1. CATEGORÍA ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="pricetag-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Categoría del alimento</Text>
            {!categoria && <View style={styles.requiredDot} />}
          </View>
          <View style={styles.categoriaGrid}>
            {CATEGORIAS.map((cat) => {
              const seleccionada = categoria === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoriaCard,
                    seleccionada && styles.categoriaCardSelected,
                    seleccionada && { borderColor: cat.color, backgroundColor: cat.color + '15' },
                  ]}
                  onPress={() => setCategoria(seleccionada ? null : cat.key)}
                  activeOpacity={0.7}>
                  <Text style={styles.categoriaIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoriaText,
                      seleccionada && { color: cat.color, fontWeight: '700' },
                    ]}>
                    {cat.key}
                  </Text>
                  {seleccionada && (
                    <View style={[styles.categoriaCheck, { backgroundColor: cat.color }]}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── 2. DESCRIPCIÓN ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="create-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Descripción del lote</Text>
            {!descripcion.trim() && <View style={styles.requiredDot} />}
          </View>
          <TextInput
            style={styles.descripcionInput}
            placeholder="Ej. Plátanos maduros, Manzanas frescas..."
            placeholderTextColor="#aaa"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            maxLength={120}
          />
          <Text style={styles.charCount}>{descripcion.length}/120</Text>
        </View>

        {/* ── 3. PESO ESTIMADO ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="scale-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Peso estimado</Text>
            {cantidadNum <= 0 && <View style={styles.requiredDot} />}
          </View>
          <View style={styles.pesoContainer}>
            <TouchableOpacity
              style={styles.pesoStepper}
              onPress={() => incrementarKg(-1)}
              activeOpacity={0.6}>
              <Ionicons name="remove" size={22} color="#2e7d32" />
            </TouchableOpacity>
            <View style={styles.pesoInputWrapper}>
              <TextInput
                style={styles.pesoInput}
                placeholder="0"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                value={cantidad}
                onChangeText={(t) => {
                  const limpio = t.replace(/[^0-9.]/g, '');
                  const partes = limpio.split('.');
                  if (partes.length > 2) return;
                  setCantidad(limpio);
                }}
                maxLength={6}
              />
              <Text style={styles.pesoUnit}>kg</Text>
            </View>
            <TouchableOpacity
              style={styles.pesoStepper}
              onPress={() => incrementarKg(1)}
              activeOpacity={0.6}>
              <Ionicons name="add" size={22} color="#2e7d32" />
            </TouchableOpacity>
          </View>
          <View style={styles.pesoQuickRow}>
            {STEPS_KG.map((step) => (
              <TouchableOpacity
                key={step}
                style={[styles.pesoQuickChip, cantidadNum === step && styles.pesoQuickChipActive]}
                onPress={() => setCantidad(step.toString())}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.pesoQuickText,
                    cantidadNum === step && styles.pesoQuickTextActive,
                  ]}>
                  {step} kg
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 4. FOTOGRAFÍA ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="camera-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Fotografía del alimento</Text>
          </View>
          <View style={styles.fotoButtons}>
            <TouchableOpacity
              style={styles.fotoBtnPrimary}
              onPress={() => void seleccionarFoto(true)}
              activeOpacity={0.7}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.fotoBtnPrimaryText}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fotoBtnSecondary}
              onPress={() => void seleccionarFoto(false)}
              activeOpacity={0.7}>
              <Ionicons name="images-outline" size={20} color="#2e7d32" />
              <Text style={styles.fotoBtnSecondaryText}>Galería</Text>
            </TouchableOpacity>
          </View>
          {imagen && (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: imagen }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.previewRemove}
                onPress={() => {
                  setImagen(null);
                  setImagenBase64(null);
                }}>
                <Ionicons name="close-circle" size={28} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── 5. HORARIO DEL PUESTO ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="storefront-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Horario de atención del puesto</Text>
          </View>
          <View style={styles.horarioRow}>
            <TouchableOpacity
              style={styles.horarioCard}
              onPress={() => abrirPicker('apertura')}
              activeOpacity={0.7}>
              <Text style={styles.horarioCardLabel}>Apertura</Text>
              <Ionicons name="sunny-outline" size={18} color="#fb8c00" />
              <Text style={styles.horarioCardTime}>{formatTime(horarioApertura)}</Text>
            </TouchableOpacity>
            <View style={styles.horarioSeparator}>
              <Ionicons name="arrow-forward" size={18} color="#aaa" />
            </View>
            <TouchableOpacity
              style={styles.horarioCard}
              onPress={() => abrirPicker('cierre')}
              activeOpacity={0.7}>
              <Text style={styles.horarioCardLabel}>Cierre</Text>
              <Ionicons name="moon-outline" size={18} color="#5c6bc0" />
              <Text style={styles.horarioCardTime}>{formatTime(horarioCierre)}</Text>
            </TouchableOpacity>
          </View>
          {horarioCierre <= horarioApertura && (
            <View style={styles.warningRow}>
              <Ionicons name="warning" size={14} color="#e65100" />
              <Text style={styles.warningText}>La hora de cierre debe ser posterior a la de apertura</Text>
            </View>
          )}
        </View>

        {/* ── 6. CADUCIDAD BIOLÓGICA ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Ionicons name="alert-circle-outline" size={16} color="#555" />
            <Text style={styles.sectionLabel}>Caducidad biológica del alimento</Text>
            {fechaCaducidad <= new Date() && <View style={styles.requiredDot} />}
          </View>
          <TouchableOpacity
            style={styles.caducidadCard}
            onPress={() => abrirPicker('caducidad_date')}
            activeOpacity={0.7}>
            <View style={styles.caducidadIconWrapper}>
              <Ionicons name="hourglass" size={24} color="#e65100" />
            </View>
            <View style={styles.caducidadInfo}>
              <Text style={styles.caducidadLabel}>Fecha y hora límite</Text>
              <Text style={styles.caducidadDate}>{formatDateTime(fechaCaducidad)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
          {fechaCaducidad <= new Date() && (
            <View style={styles.warningRow}>
              <Ionicons name="warning" size={14} color="#d32f2f" />
              <Text style={[styles.warningText, { color: '#d32f2f' }]}>
                La fecha de caducidad debe ser futura
              </Text>
            </View>
          )}
        </View>

        {/* ── 7. VALIDACIONES ── */}
        {errores.length > 0 && (
          <View style={styles.validacionesContainer}>
            {errores.map((err, i) => (
              <View key={i} style={styles.validacionRow}>
                <Ionicons name="close-circle" size={14} color="#d32f2f" />
                <Text style={styles.validacionText}>{err}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── 8. BOTÓN PUBLICAR ── */}
        <TouchableOpacity
          style={[styles.publishButton, (!puedePublicar || publicando) && styles.publishButtonDisabled]}
          onPress={() => void manejarPublicacion()}
          disabled={!puedePublicar || publicando}
          activeOpacity={0.8}>
          {publicando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="cloud-upload" size={22} color="#fff" />
          )}
          <Text style={styles.publishButtonText}>
            {publicando ? 'Publicando...' : 'Publicar Lote'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── DATE / TIME PICKER ── */}
      {pickerVisible && (
        <DateTimePicker
          value={getPickerValue()}
          mode={getPickerMode()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={manejarPicker}
          minimumDate={new Date()}
        />
      )}

      {/* ── TOAST ── */}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Section */
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  requiredDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#d32f2f',
    marginLeft: 4,
  },

  /* Descripción */
  descripcionInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'right',
    marginTop: 4,
  },

  /* Categoría */
  categoriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoriaCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  categoriaCardSelected: {
    borderWidth: 2,
  },
  categoriaIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  categoriaText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  categoriaCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Peso */
  pesoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  pesoStepper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
  },
  pesoInputWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  pesoInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
    textAlign: 'center',
    minWidth: 60,
    paddingVertical: 0,
  },
  pesoUnit: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    marginLeft: 4,
  },
  pesoQuickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  pesoQuickChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pesoQuickChipActive: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  pesoQuickText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  pesoQuickTextActive: {
    color: '#fff',
  },

  /* Foto */
  fotoButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fotoBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  fotoBtnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  fotoBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    borderWidth: 1.5,
    borderColor: '#a5d6a7',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  fotoBtnSecondaryText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 15,
  },
  previewWrapper: {
    marginTop: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  previewRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  /* Horario del puesto */
  horarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  horarioCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 4,
  },
  horarioCardLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horarioCardTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  horarioSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  /* Caducidad */
  caducidadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderWidth: 1.5,
    borderColor: '#ffcc80',
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  caducidadIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffe0b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caducidadInfo: {
    flex: 1,
  },
  caducidadLabel: {
    fontSize: 11,
    color: '#e65100',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  caducidadDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },

  /* Warning */
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#e65100',
    fontWeight: '500',
  },

  /* Validaciones */
  validacionesContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 6,
  },
  validacionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validacionText: {
    fontSize: 13,
    color: '#c62828',
    fontWeight: '500',
  },

  /* Publicar */
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  publishButtonDisabled: {
    backgroundColor: '#a5d6a7',
    elevation: 0,
    shadowOpacity: 0,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  /* Toast */
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
