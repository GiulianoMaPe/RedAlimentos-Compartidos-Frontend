import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// IMPORTAMOS LA LIBRERÍA DE ÍCONOS DE EXPO
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface Donacion { id: number; descripcion: string; estado: string; puesto_id: number; }
interface Trazabilidad { id_trazabilidad: number; fecha: string; co2: number; frescura: number; }
interface ReservaPendiente { id_reserva: number; descripcion: string; }

export default function HomeScreen() {
  const [vista, setVista] = useState<'feed' | 'pendientes' | 'impacto'>('feed');
  
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [pendientes, setPendientes] = useState<ReservaPendiente[]>([]);
  const [impactoData, setImpactoData] = useState({ co2_total: 0, historial: [] as Trazabilidad[] });
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  const cargarDonaciones = () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}donaciones`)
      .then(res => { setDonaciones(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  };

  const cargarImpacto = () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}mi-impacto/1`)
      .then(res => { setImpactoData(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  };

  const cargarPendientes = () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API_URL}reservas-pendientes/1`)
      .then(res => { setPendientes(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    if (vista === 'feed') cargarDonaciones();
    else if (vista === 'impacto') cargarImpacto();
    else cargarPendientes();
  }, [vista]);

  const reservarLote = (id_donacion: number) => {
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}reservar/${id_donacion}?comedor_id=1`)
      .then(response => {
        mostrarNotificacion(response.data.mensaje, 'success'); // Sin emojis
        cargarDonaciones(); 
      })
      .catch(error => mostrarNotificacion("Error: " + error.message, 'error')); // Sin emojis
  };

  const calificarRecojo = (id_reserva: number, puntaje: number) => {
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}confirmar-recojo/${id_reserva}?puntaje_frescura=${puntaje}`)
      .then(response => {
        mostrarNotificacion(response.data.impacto, 'success'); // Sin emojis
        cargarPendientes(); 
      })
      .catch(error => mostrarNotificacion("Error: " + error.message, 'error')); // Sin emojis
  };

  const renderDonacion = ({ item }: { item: Donacion }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Lote #{item.id}</Text>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <TouchableOpacity style={styles.button} onPress={() => reservarLote(item.id)}>
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrazabilidad = ({ item }: { item: Trazabilidad }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recojo del {item.fecha}</Text>
      <View style={styles.iconRow}>
        <Text style={styles.cardDesc}>Frescura: {item.frescura} / 5</Text>
        <Ionicons name="star" size={18} color="#fbc02d" style={{ marginLeft: 5, marginBottom: 10 }} />
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="leaf" size={18} color="#2e7d32" style={{ marginRight: 5 }} />
        <Text style={styles.co2Text}>Ahorro: {item.co2} kg CO2</Text>
      </View>
    </View>
  );

  const renderPendiente = ({ item }: { item: ReservaPendiente }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Reserva #{item.id_reserva}</Text>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>
      <Text style={styles.instructionText}>¿Ya lo recogiste? Califica la frescura para confirmar:</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((estrella) => (
          <TouchableOpacity key={estrella} style={styles.starButton} onPress={() => calificarRecojo(item.id_reserva, estrella)}>
            <Text style={styles.starText}>{estrella}</Text>
            <Ionicons name="star" size={16} color="#f57f17" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navBtn, vista === 'feed' && styles.navBtnActive]} onPress={() => setVista('feed')}>
          <MaterialIcons name="local-grocery-store" size={24} color={vista === 'feed' ? '#2e7d32' : '#666'} />
          <Text style={[styles.navText, vista === 'feed' && styles.navTextActive]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, vista === 'pendientes' && styles.navBtnActive]} onPress={() => setVista('pendientes')}>
          <MaterialIcons name="pending-actions" size={24} color={vista === 'pendientes' ? '#2e7d32' : '#666'} />
          <Text style={[styles.navText, vista === 'pendientes' && styles.navTextActive]}>Recojos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, vista === 'impacto' && styles.navBtnActive]} onPress={() => setVista('impacto')}>
          <Ionicons name="earth" size={24} color={vista === 'impacto' ? '#2e7d32' : '#666'} />
          <Text style={[styles.navText, vista === 'impacto' && styles.navTextActive]}>Impacto</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      ) : vista === 'feed' ? (
        <FlatList data={donaciones} keyExtractor={(i) => i.id.toString()} renderItem={renderDonacion} onRefresh={cargarDonaciones} refreshing={loading} ListEmptyComponent={<Text style={styles.emptyText}>No hay donaciones</Text>} />
      ) : vista === 'pendientes' ? (
        <FlatList data={pendientes} keyExtractor={(i) => i.id_reserva.toString()} renderItem={renderPendiente} onRefresh={cargarPendientes} refreshing={loading} ListEmptyComponent={<Text style={styles.emptyText}>No tienes recojos pendientes</Text>} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.impactHeader}>
            <Ionicons name="cloud-done" size={32} color="#2e7d32" style={{ marginBottom: 5 }} />
            <Text style={styles.impactTitle}>Huella Evitada</Text>
            <Text style={styles.impactNumber}>{impactoData.co2_total} kg</Text>
          </View>
          <FlatList data={impactoData.historial} keyExtractor={(i) => i.id_trazabilidad.toString()} renderItem={renderTrazabilidad} onRefresh={cargarImpacto} refreshing={loading} ListEmptyComponent={<Text style={styles.emptyText}>Sin historial</Text>} />
        </View>
      )}

      {toast.visible && (
        <View style={[styles.toast, toast.tipo === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Ionicons 
            name={toast.tipo === 'error' ? 'close-circle' : 'checkmark-circle'} 
            size={24} 
            color={toast.tipo === 'error' ? '#fff' : '#81c784'} // Blanco para error, Verde claro para éxito
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
  navBar: { flexDirection: 'row', backgroundColor: '#fff', paddingTop: 45, paddingBottom: 10, elevation: 4 },
  navBtn: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  navBtnActive: { borderBottomColor: '#2e7d32' },
  navText: { fontSize: 12, color: '#666', fontWeight: '600', marginTop: 4 },
  navTextActive: { color: '#2e7d32' },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDesc: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  button: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  impactHeader: { backgroundColor: '#e8f5e9', margin: 15, padding: 20, borderRadius: 15, alignItems: 'center' },
  impactTitle: { fontSize: 16, color: '#2e7d32', fontWeight: '600' },
  impactNumber: { fontSize: 36, fontWeight: 'bold', color: '#1b5e20', marginTop: 5 },
  co2Text: { fontSize: 16, color: '#2e7d32', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 16 },
  instructionText: { color: '#555', marginBottom: 10, fontStyle: 'italic' },
  starsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  starButton: { flexDirection: 'row', backgroundColor: '#fff9c4', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fbc02d', alignItems: 'center' },
  starText: { fontSize: 16, fontWeight: 'bold', color: '#f57f17' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  
  // ESTILOS DEL TOAST CON ÍCONO
  toast: { flexDirection: 'row', position: 'absolute', bottom: 30, alignSelf: 'center', width: '85%', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, alignItems: 'center', justifyContent: 'center' },
  toastSuccess: { backgroundColor: '#333333' },
  toastError: { backgroundColor: '#d32f2f' },   
  toastText: { color: '#fff', fontSize: 15, fontWeight: '600', maxWidth: '90%' }
});