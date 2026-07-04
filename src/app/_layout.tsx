import { Stack } from "expo-router";
import React from "react";

import { SessionProvider } from "@/context/SessionContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ animation: 'fade' }}>
        <Stack.Screen name="index" options={{ title: "FoodLinks" }} />
        <Stack.Screen name="login" options={{ title: "Iniciar Sesión" }} />
        <Stack.Screen name="register" options={{ title: "Crear Cuenta" }} />
        <Stack.Screen name="comedor" options={{ headerShown: false }} />
        <Stack.Screen name="comerciante" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ title: "Mi Perfil" }} />
      </Stack>
    </SessionProvider>
  );
}
