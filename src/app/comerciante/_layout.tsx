import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ComercianteTabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5 + insets.bottom, paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerStyle: { backgroundColor: '#2e7d32' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/perfil')}
            style={{ marginRight: 15 }}>
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="publicar"
        options={{
          title: 'Publicar',
          headerTitle: 'Publicar Excedente',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          headerTitle: 'Historial de Publicaciones',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
