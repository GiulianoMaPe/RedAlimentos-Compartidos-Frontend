import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(): Promise<string> {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signOut();
  const result = await GoogleSignin.signIn();
  const data = result as { data?: { idToken?: string } };
  if (!data.data?.idToken) {
    throw new Error('No se pudo obtener el token de Google');
  }
  return data.data.idToken;
}
