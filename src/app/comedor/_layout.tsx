import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function ComedorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5, paddingTop: 5 },
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
        name="feed"
        options={{
          title: 'Feed',
          headerTitle: 'Donaciones Disponibles',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-grocery-store" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recojos"
        options={{
          title: 'Recojos',
          headerTitle: 'Mis Recojos Pendientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pending-actions" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="impacto"
        options={{
          title: 'Impacto',
          headerTitle: 'Mi Impacto Ambiental',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="earth" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
