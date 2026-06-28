import { Alert, Platform } from 'react-native';

type ConfirmarAccionOpciones = {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  onConfirmar: () => void;
  destructivo?: boolean;
};

/**
 * Muestra un diálogo de confirmación multiplataforma.
 *
 * En móvil usa el `Alert` nativo de React Native. En web `Alert` no se renderiza
 * (es un no-op en react-native-web), así que recurrimos al `confirm` del navegador.
 * En ambos casos, `onConfirmar` se ejecuta solo si el usuario acepta.
 */
export function confirmarAccion({
  titulo,
  mensaje,
  textoConfirmar,
  onConfirmar,
  destructivo = false,
}: ConfirmarAccionOpciones): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${titulo}\n\n${mensaje}`)) {
      onConfirmar();
    }
    return;
  }

  Alert.alert(titulo, mensaje, [
    { text: 'Volver', style: 'cancel' },
    {
      text: textoConfirmar,
      style: destructivo ? 'destructive' : 'default',
      onPress: onConfirmar,
    },
  ]);
}
