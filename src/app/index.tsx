import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [mensaje, setMensaje] = useState('Conectando al servidor...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚨 IMPORTANTE: 
    // Si usas el Emulador de Android en tu PC, usa: 'http://10.0.2.2:8000/'
    // Si usas tu celular físico por Wi-Fi, usa la IP de tu PC: 'process.env.EXPO_PUBLIC_API_URL'
    // Si pruebas en la Web, usa: 'http://127.0.0.1:8000/'
    
    axios.get(process.env.EXPO_PUBLIC_API_URL)
      .then(response => {
        setMensaje(response.data.mensaje);
        setLoading(false);
      })
      .catch(error => {
        setMensaje('Error de red: ' + error.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado del Sistema</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={styles.message}>{mensaje}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  message: { fontSize: 18, color: '#2e7d32', textAlign: 'center', fontWeight: '500' }
});