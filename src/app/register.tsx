import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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

import { getApiErrorMessage } from '@/api/errors';
import { useSession } from '@/context/SessionContext';
import { signInWithGoogle } from '@/utils/googleAuth';
import MapaSeleccion from '@/components/MapaSeleccion';

const DEFAULT_COORDS = { latitude: -12.0464, longitude: -77.0428 };

export default function RegisterScreen() {
  const { rol } = useLocalSearchParams<{ rol: string }>();
  const { register, loginWithGoogle, loading } = useSession();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [coordenadas, setCoordenadas] = useState(DEFAULT_COORDS);
  const [error, setError] = useState('');
  const [emailDuplicado, setEmailDuplicado] = useState(false);

  const esComedor = rol === 'comedor';
  const titulo = esComedor ? 'Comedor' : 'Comerciante';
  const rolBackend = esComedor ? 'GestorComedor' : 'Comerciante';

  const coordenadasCambiadas =
    coordenadas.latitude !== DEFAULT_COORDS.latitude ||
    coordenadas.longitude !== DEFAULT_COORDS.longitude;

  const handleRegister = async () => {
    setError('');
    setEmailDuplicado(false);

    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmar.trim()) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!coordenadasCambiadas) {
      setError('Arrastra el marcador para fijar tu ubicación');
      return;
    }

    try {
      const data = await register(
        nombre.trim(),
        email.trim(),
        password,
        rolBackend,
        coordenadas.latitude,
        coordenadas.longitude,
      );
      if (data.rol !== rolBackend) {
        setError('Error al crear la cuenta');
        return;
      }
      router.replace(esComedor ? '/comedor/feed' : '/comerciante/publicar');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      if (msg.toLowerCase().includes('409') || msg.toLowerCase().includes('registrado')) {
        setEmailDuplicado(true);
        setError('Este correo ya está registrado en el sistema');
      } else {
        setError(msg);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const idToken = await signInWithGoogle();
      const data = await loginWithGoogle(idToken, rolBackend);
      if (data.rol !== rolBackend) {
        setError(`Esta cuenta es tipo "${data.rol}", no "${titulo}"`);
        return;
      }
      if (data.is_new_user) {
        router.replace('/completar-ubicacion');
      } else {
        router.replace(esComedor ? '/comedor/feed' : '/comerciante/publicar');
      }
    } catch (err) {
      console.error('Google register error:', err);
      setError('No se pudo registrar con Google');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo-vertical.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>{titulo}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#8A9686"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#8A9686"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#8A9686"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite la contraseña"
            placeholderTextColor="#8A9686"
            secureTextEntry
            value={confirmar}
            onChangeText={setConfirmar}
          />

          {/* ── MAPA ── */}
          <View style={styles.mapSection}>
            <View style={styles.sectionLabelRow}>
              <Ionicons name="location-outline" size={16} color="#5A6657" />
              <Text style={styles.sectionLabel}>Ubicación del puesto/comedor</Text>
              {!coordenadasCambiadas && <View style={styles.requiredDot} />}
            </View>

            <MapaSeleccion
              coordenadas={coordenadas}
              onDragEnd={setCoordenadas}
              altura={200}
            />

            <View style={styles.coordDisplay}>
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
                <Text style={styles.hintText}>Mueve el pin para fijar tu ubicación</Text>
              </View>
            )}
          </View>

          {error ? (
            emailDuplicado ? (
              <View style={styles.duplicateEmailBanner}>
                <Ionicons name="mail-outline" size={22} color="#B71C1C" />
                <View style={styles.duplicateEmailContent}>
                  <Text style={styles.duplicateEmailTitle}>{error}</Text>
                  <Text style={styles.duplicateEmailHint}>
                    Si ya creaste tu cuenta con Google, usa &ldquo;Continuar con Google&rdquo; para iniciar sesión.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.errorRow}>
                <Ionicons name="close-circle" size={18} color="#B3261E" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleRegister()}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={() => void handleGoogleLogin()}
            disabled={loading}
            activeOpacity={0.8}>
            <View style={styles.googleLogo}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.replace({ pathname: '/login', params: { rol } })}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.linkTextBold}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F2',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 180,
    aspectRatio: 669 / 373,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#131A12',
  },
  subtitle: {
    fontSize: 15,
    color: '#1E5631',
    fontWeight: '600',
    marginTop: 4,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3DCD0',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A6657',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3DCD0',
    borderRadius: 999,
    padding: 14,
    height: 48,
    fontSize: 16,
    color: '#131A12',
    marginBottom: 14,
  },

  /* Mapa */
  mapSection: {
    marginTop: 6,
    marginBottom: 4,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A6657',
  },
  requiredDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#d32f2f',
    marginLeft: 4,
  },
  coordDisplay: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
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
  },
  coordVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E5631',
    marginTop: 2,
  },
  coordDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#D3DCD0',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#888',
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  errorText: {
    color: '#B3261E',
    fontSize: 14,
  },
  duplicateEmailBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: '#EF9A9A',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  duplicateEmailContent: {
    flex: 1,
  },
  duplicateEmailTitle: {
    color: '#B71C1C',
    fontSize: 14,
    fontWeight: '700',
  },
  duplicateEmailHint: {
    color: '#7f1d1d',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E5631',
    height: 52,
    borderRadius: 999,
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3DCD0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#8A9686',
    fontSize: 13,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#D3DCD0',
    gap: 10,
  },
  googleLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  googleButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    color: '#5A6657',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#1E5631',
    fontSize: 14,
    fontWeight: '700',
  },
});
