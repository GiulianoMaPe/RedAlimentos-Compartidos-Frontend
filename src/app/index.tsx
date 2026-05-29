import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Definimos la estructura de datos que esperamos de Python
interface Donacion {
  id: number;
  descripcion: string;
  estado: string;
  puesto_id: number;
}

export default function HomeScreen() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Esta función llama a Python
  const cargarDonaciones = () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}donaciones`)
      .then(response => {
        setDonaciones(response.data); // Guardamos la lista de Python en el estado
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  // Se ejecuta automáticamente al abrir la pantalla
  useEffect(() => {
    cargarDonaciones();
  }, []);

  // Cómo se dibuja cada "tarjeta" de la lista
  const renderTarjeta = ({ item }: { item: Donacion }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Lote #{item.id}</Text>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <Text style={styles.cardStatus}>{item.estado}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Donaciones Disponibles</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" />
      ) : (
        <FlatList
          data={donaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTarjeta}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={cargarDonaciones} // Permite recargar al jalar hacia abajo
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', padding: 20, paddingTop: 40, backgroundColor: '#fff', elevation: 2 },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  cardStatus: { fontSize: 14, color: '#2e7d32', fontWeight: '600', marginBottom: 15 },
  button: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});