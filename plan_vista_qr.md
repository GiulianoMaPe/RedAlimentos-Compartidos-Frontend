# 📋 Plan: Vista de Código QR y PIN de Verificación

## Objetivo
Crear una pantalla que, tras reservar una donación, muestre el `codigo_verificacion` del backend tanto como **código QR visual** como **PIN numérico en texto grande**, para que el gestor del comedor lo presente al momento del recojo.

---

## ⚠️ Dependencia de Backend (LEER PRIMERO)

> [!WARNING]
> Esta tarea **depende de un cambio en el backend que aún NO está implementado**.
> Hoy el backend **no genera ni devuelve** `codigo_verificacion` en `POST /reservar/{id}`
> (la columna existe pero nunca se asigna; `ReservaResponse` no lo expone).
>
> El requerimiento está documentado para el equipo de backend en:
> `Red_de_alimentos_Compartidos_Backend/docs/requerimiento_codigo_verificacion.md`

**Estrategia para no quedar bloqueados:** desarrollamos el frontend completo contra un
**mock local** del campo, detrás de un flag, y al integrar solo se quita el mock.
Ver [Paso 0](#paso-0-desbloqueo-mock-temporal).

---

## 📍 Contexto del Proyecto Actual

| Aspecto | Estado actual |
|---|---|
| **SDK** | Expo 54 (React Native 0.81) |
| **Routing** | `expo-router` v6 (file-based, Stack + Tabs) |
| **API client** | Axios (`src/api/client.ts`) |
| **Reservas API** | `src/api/reservas.ts` — `reservarDonacion()` retorna `{ status, mensaje, id_reserva }` |
| **Tipos** | `src/api/types.ts` — `ReservaResponse` **no incluye** `codigo_verificacion` aún |
| **Flujo actual** | Comedor → `src/app/comedor/feed.tsx` (reservar) → solo muestra toast de éxito |
| **Paleta de colores** | Verde `#2e7d32`, fondo `#f0f2f5`, cards blancas |

> [!NOTE]
> Rutas reales del proyecto: `/Users/mathiastl/Projects/Foodlinks/RedAlimentos-Compartidos-Frontend/...`

---

## 🔧 Pasos de Implementación

### Paso 0: Desbloqueo (mock temporal)

Mientras backend no devuelva el campo, generamos un PIN de prueba en el frontend para
poder construir y probar toda la UI. Aislamos esto en un único punto para borrarlo fácil.

**Archivo:** `src/api/reservas.ts`

```ts
// TODO(backend): eliminar cuando POST /reservar/{id} devuelva codigo_verificacion.
// Ver requerimiento_codigo_verificacion.md en el repo de backend.
const USAR_MOCK_CODIGO = true;

export async function reservarDonacion(idDonacion: number, comedorId: number): Promise<ReservaResponse> {
  const { data } = await client.post<ReservaResponse>(`/reservar/${idDonacion}`, null, {
    params: { comedor_id: comedorId },
  });

  if (USAR_MOCK_CODIGO && !data.codigo_verificacion) {
    return { ...data, codigo_verificacion: String(Math.floor(100000 + Math.random() * 900000)) };
  }
  return data;
}
```

> [!IMPORTANT]
> Al integrar con backend real: poner `USAR_MOCK_CODIGO = false` (o borrar el bloque).
> El resto del frontend **no cambia**, porque siempre lee `response.codigo_verificacion`.

---

### Paso 1: Instalar librería de QR

```bash
npx expo install react-native-qrcode-svg react-native-svg
```

> [!NOTE]
> `react-native-qrcode-svg` depende de `react-native-svg`. Usamos `npx expo install` para
> asegurar versiones compatibles con SDK 54.

---

### Paso 2: Actualizar el tipo `ReservaResponse`

**Archivo:** `src/api/types.ts`

```diff
 export interface ReservaResponse {
   status: string;
   mensaje: string;
   id_reserva: number;
+  codigo_verificacion: string;
 }
```

> [!IMPORTANT]
> El backend lo entregará como **PIN numérico de 6 dígitos en formato string**
> (puede tener ceros a la izquierda, ej. `"048291"`). **No** convertir a `number`.

---

### Paso 3: Crear la pantalla de QR

**Archivo nuevo:** `src/app/comedor/verificacion.tsx`

| Elemento | Detalle |
|---|---|
| **Ruta** | `/comedor/verificacion?codigo=XXXXXX&idReserva=123` |
| **Params** | `codigo` (string) — el PIN, `idReserva` (string) — referencia visible |
| **Componentes** | QR (grande, centrado), PIN en texto grande, botón "Volver al Feed" |

#### Estructura visual de la pantalla:

```
┌──────────────────────────────┐
│     ✅ ¡Reserva Exitosa!     │
│       Reserva #123           │
│                              │
│    ┌────────────────────┐    │
│    │    [CÓDIGO QR]     │    │
│    └────────────────────┘    │
│                              │
│     Tu código de recojo:     │
│        ╔══════════╗          │
│        ║  048291  ║          │
│        ╚══════════╝          │
│                              │
│  Muestra este código al      │
│  comerciante al recoger.     │
│                              │
│  ┌──────────────────────┐    │
│  │   Volver al Feed     │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

#### Comportamiento del componente:

```tsx
// 1. Recibe `codigo` e `idReserva` como search params (useLocalSearchParams).
// 2. Guard: si `codigo` viene vacío/undefined → mostrar estado de error
//    ("No se pudo generar el código, contacta soporte") en vez de un QR roto.
// 3. Renderiza <QRCode value={codigo} size={220} /> de react-native-qrcode-svg.
// 4. Muestra el PIN en texto grande (≥40px, letterSpacing, monoespaciado).
// 5. Botón para navegar de vuelta al feed (router.replace para no apilar).
// 6. Usa la paleta del proyecto (#2e7d32, #f0f2f5).
```

> [!TIP]
> Usar `router.replace('/comedor/feed')` en "Volver" (no `push`) para que el botón
> físico de atrás no regrese a la pantalla de QR de una reserva ya hecha.

---

### Paso 4: Registrar la pantalla en el layout de tabs del comedor

**Archivo:** `src/app/comedor/_layout.tsx`

```diff
+      <Tabs.Screen
+        name="verificacion"
+        options={{
+          href: null,  // No mostrar en la barra de tabs
+          title: 'Verificación',
+          headerTitle: 'Código de Verificación',
+        }}
+      />
```

> [!NOTE]
> En expo-router con tabs, las pantallas de la carpeta se registran automáticamente como
> tabs. `href: null` la oculta del tab bar pero permite navegar a ella programáticamente.

---

### Paso 5: Modificar el flujo de reserva en `feed.tsx`

**Archivo:** `src/app/comedor/feed.tsx`

```diff
  const reservarLote = async (idDonacion: number) => {
    ...
    try {
      const response = await reservarDonacion(idDonacion, usuario.comedor_id);
-     mostrarNotificacion(response.mensaje, 'success');
-     await cargarDonaciones();
+     await cargarDonaciones();  // refresca el feed antes de salir
+     router.push({
+       pathname: '/comedor/verificacion',
+       params: {
+         codigo: response.codigo_verificacion,
+         idReserva: response.id_reserva.toString(),
+       },
+     });
    } catch (error) {
      ...
    }
  };
```

> [!NOTE]
> Se mantiene `cargarDonaciones()` para que el feed quede actualizado cuando el usuario vuelva.

---

## 📁 Resumen de archivos a tocar

| Archivo | Acción |
|---|---|
| `package.json` | 🆕 Agregar `react-native-qrcode-svg` y `react-native-svg` |
| `src/api/reservas.ts` | ✏️ Mock temporal del código (Paso 0, se borra al integrar) |
| `src/api/types.ts` | ✏️ Agregar `codigo_verificacion` a `ReservaResponse` |
| `src/app/comedor/verificacion.tsx` | 🆕 Crear pantalla de QR + PIN |
| `src/app/comedor/_layout.tsx` | ✏️ Registrar pantalla con `href: null` |
| `src/app/comedor/feed.tsx` | ✏️ Navegar a verificación tras reservar |

---

## ⚠️ Dependencias externas

1. **Backend debe generar y devolver `codigo_verificacion`** en `POST /reservar/{id}`.
   → Documentado en `Red_de_alimentos_Compartidos_Backend/docs/requerimiento_codigo_verificacion.md`.
   → Formato acordado: **PIN numérico de 6 dígitos (string)**.
2. **(Opcional) Re-consulta del código:** para "volver a ver el QR", backend debería incluir
   `codigo_verificacion` en `GET /reservas-pendientes/{comedor_id}`. Por ahora no se implementa
   en frontend.

---

## 🧪 Testing Manual

### Fase A — con mock (sin backend integrado)
1. `USAR_MOCK_CODIGO = true`.
2. Login como **GestorComedor** → Feed → "Reservar".
3. Verificar navegación a la pantalla de **verificación**.
4. Verificar que el **QR** se renderiza y que el **PIN** se muestra grande y legible.
5. Verificar el **guard** de código vacío (forzar `codigo=""` y comprobar el estado de error).
6. "Volver al Feed" → regresa y la donación cambió de estado.

### Fase B — con backend real (integración)
1. `USAR_MOCK_CODIGO = false`.
2. Reservar y confirmar que el QR/PIN proviene del backend.
3. Validar ese mismo código en `POST /reservas/{id}/validar` → `valido: true`.
