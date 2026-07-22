import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSession } from '@/context/SessionContext';
import { signInWithGoogle } from '@/utils/googleAuth';

export default function LoginScreen() {
  const { rol } = useLocalSearchParams<{ rol: string }>();
  const { login, loginWithGoogle, loading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const esComedor = rol === 'comedor';
  const titulo = esComedor ? 'Comedor' : 'Comerciante';
  const rolBackend = esComedor ? 'GestorComedor' : 'Comerciante';

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    try {
      const data = await login(email.trim(), password);
      if (data.rol !== rolBackend) {
        setError(`Esta cuenta es tipo "${data.rol}", no "${titulo}"`);
        return;
      }
      router.replace(esComedor ? '/comedor/feed' : '/comerciante/publicar');
    } catch {
      setError('Credenciales inválidas');
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
      router.replace(esComedor ? '/comedor/feed' : '/comerciante/publicar');
    } catch (err) {
      console.error('Google login error:', err);
      setError('No se pudo iniciar sesión con Google');
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
          <Ionicons name={esComedor ? 'restaurant' : 'storefront'} size={40} color="#1E5631" />
          <Text style={styles.title}>Inicio de Sesión</Text>
          <Text style={styles.subtitle}>{titulo}</Text>
        </View>

        <View style={styles.form}>
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
            placeholder="••••••••"
            placeholderTextColor="#8A9686"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="close-circle" size={18} color="#B3261E" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleLogin()}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </>
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
            disabled={loading}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.replace({ pathname: '/register', params: { rol } })}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#131A12', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#1E5631', fontWeight: '600', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#D3DCD0' },
  label: { fontSize: 14, fontWeight: '600', color: '#5A6657', marginBottom: 6 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3DCD0',
    borderRadius: 999,
    padding: 14,
    height: 48,
    fontSize: 16,
    color: '#131A12',
    marginBottom: 16,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  errorText: { color: '#B3261E', fontSize: 14 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E5631',
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E5631',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E5631',
    marginRight: 10,
  },
  googleButtonText: {
    color: '#1E5631',
    fontWeight: '600',
    fontSize: 15,
  },
  linkRow: { alignItems: 'center', marginTop: 24 },
  linkText: { color: '#1E5631', fontSize: 14, fontWeight: '600' },
});
