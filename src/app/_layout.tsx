import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Red de Alimentos" }} />
      <Stack.Screen name="comedor" options={{ headerShown: false }} />
      <Stack.Screen name="comerciante" options={{ headerShown: false }} />
      <Stack.Screen name="perfil" options={{ title: "Mi Perfil" }} />
    </Stack>
  );
}