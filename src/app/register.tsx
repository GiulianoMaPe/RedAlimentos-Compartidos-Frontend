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

import { getApiErrorMessage } from '@/api/errors';
import { useSession } from '@/context/SessionContext';

export default function RegisterScreen() {
  const { rol } = useLocalSearchParams<{ rol: string }>();
  const { register, loading } = useSession();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  const esComedor = rol === 'comedor';
  const titulo = esComedor ? 'Comedor' : 'Comerciante';

  const handleRegister = async () => {
    setError('');

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

    try {
      const data = await register(
        nombre.trim(),
        email.trim(),
        password,
        esComedor ? 'GestorComedor' : 'Comerciante',
      );
      if (data.rol !== (esComedor ? 'GestorComedor' : 'Comerciante')) {
        setError('Error al crear la cuenta');
        return;
      }
      router.replace(esComedor ? '/comedor/feed' : '/comerciante/publicar');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      if (msg.toLowerCase().includes('409') || msg.toLowerCase().includes('registrado')) {
        setError('El correo ya está registrado');
      } else {
        setError(msg);
      }
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
          <Ionicons name={esComedor ? 'restaurant' : 'storefront'} size={40} color="#2e7d32" />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>{titulo}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite la contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmar}
            onChangeText={setConfirmar}
          />

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="close-circle" size={18} color="#d32f2f" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => void handleRegister()}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.replace({ pathname: '/login', params: { rol } })}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#2e7d32', fontWeight: '600', marginTop: 4 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 14,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  errorText: { color: '#d32f2f', fontSize: 14 },
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
  linkRow: { alignItems: 'center', marginTop: 18 },
  linkText: { color: '#2e7d32', fontSize: 14, fontWeight: '600' },
});
