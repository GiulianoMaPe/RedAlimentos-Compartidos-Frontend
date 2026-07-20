# Guia de Builds y Updates - FoodLinks

## 1. Prerrequisitos

- **Node.js** >= 20.19.4
- **npm** (no usar yarn ni pnpm)
- Cuenta en [expo.dev](https://expo.dev)
- Cuenta en [Google Cloud Console](https://console.cloud.google.com) (para Google Maps)
- Android SDK / Xcode (solo si se buildea localmente)

## 2. Configuracion inicial (una sola vez)

```powershell
# 1. Clonar el repo
git clone <url-del-repo>
cd RedAlimentos-Frontend

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Copiar .env (pedir al equipo, NUNCA esta en el repo)
# Contenido minimo:
#   google_maps_api_key=TU_API_KEY_DE_GOOGLE
#   EXPO_PUBLIC_API_URL=https://red-de-alimentos-compartidos-backend-959023447340.europe-west1.run.app

# 4. Login en EAS
npx eas login

# 5. Verificar que el proyecto esta vinculado
npx eas project:info

# 6. Verificar que los secrets existen
npx eas secret:list
# Debe mostrar: google_maps_api_key=*****

# 7. Generar archivos nativos (si es necesario)
npx expo prebuild --clean

# 8. Verificar que todo compila
npx tsc --noEmit
npx expo lint
```

## 3. Variables de entorno

| Variable | `.env` (local) | `eas.json` | EAS Secret |
|----------|:-:|:-:|:-:|
| `google_maps_api_key` | Si | No | Si |
| `EXPO_PUBLIC_API_URL` | Si | Si | No |

**Reglas:**
- **NUNCA** commitear la API key real de Google Maps al repo
- `.env` esta en `.gitignore` y no se sube a GitHub
- Los EAS Secrets se inyectan automaticamente durante el build (no usar `@nombre` en `eas.json`)
- `EXPO_PUBLIC_API_URL` si va en `eas.json` porque no es sensible

## 4. Profiles de Build

| Profile | Tipo | Uso | Comando |
|---------|------|-----|---------|
| `development` | Dev client | Desarrollo con QR | `npx eas build --profile development` |
| `preview` | APK | Prueba interna, sin store | `npx eas build --profile preview` |
| `production` | AAB | Google Play | `npx eas build --profile production` |

- **development**: Instala un dev client en el dispositivo. Escaneas el QR con `npx expo start` y desarrollas en caliente.
- **preview**: Genera un APK para instalar directamente en dispositivos. Ideal para probar antes de subir a la store.
- **production**: Genera un AAB para subir a Google Play. El `versionCode` se incrementa automatico (`autoIncrement: true`).

## 5. Comandos de Build

```powershell
# Build de preview (APK para pruebas)
npx eas build --platform android --profile preview

# Build de produccion (AAB para Google Play)
npx eas build --platform android --profile production

# Ver historial de builds
npx eas build:list

# Descargar el APK de un build
npx eas build:download <build-id>
```

## 6. OTA Updates (sin rebuild)

Las actualizaciones OTA (Over-The-Air) solo cambian el **bundle de JavaScript**. No tocan codigo nativo.

```powershell
# Enviar un update
npx eas update --branch <branch> --message "fix: descripcion del cambio"

# Ejemplo
npx eas update --branch main --message "feat: agregar boton de filtro"
```

**Cuando usar update vs build:**

| Cambio | Usar |
|--------|------|
| Corregir bug en JS/TS | `eas update` |
| Agregar feature en JS/TS | `eas update` |
| Cambiar estilos | `eas update` |
| Cambiar dependencia nativa | `eas build` |
| Modificar `app.config.ts` | `eas build` |
| Agregar/quitar plugins | `eas build` |
| Cambiar version de Expo SDK | `eas build` |

## 7. Versionado

- **`version`** en `app.config.ts`: Version legible (ej: `"1.0.0"`)
- **`autoIncrement: true`** en `eas.json` (production): Incrementa el `versionCode` automaticamente en cada build de produccion
- **`runtimeVersion`**: Usa la policy `"appVersion"`, asi que cada vez que cambia la version, los devices viejos dejan de recibir updates OTA

**Cuando incrementar la version:**
- Cambios menores (bug fixes): mantener `1.0.0`
- Features nuevas: cambiar a `1.1.0`
- Cambios breaking o release mayor: cambiar a `2.0.0`

## 8. Google Maps (expo-maps)

La app usa `expo-maps` (no `react-native-maps`) con Google Maps en Android.

### Requisitos en Google Cloud Console

1. Ir a [Google Cloud Console > APIs](https://console.cloud.google.com/apis)
2. Habilitar **Maps SDK for Android**
3. Habilitar **billing** en el proyecto
4. Ir a [Credentials](https://console.cloud.google.com/apis/credentials)
5. Editar la API key:
   - **Application restrictions**: `Android apps`
   - Agregar package name: `com.giuliano14.foodlinks`
   - Agregar SHA-1 del keystore de EAS

### Obtener el SHA-1 de EAS

```powershell
npx eas credentials -p android
```

Seleccionar el profile `preview` o `production` > Keystore > copiar el SHA-1 Certificate Fingerprint.

### Configuracion en el proyecto

- `app.config.ts`: `android.config.googleMaps.apiKey` lee `process.env.google_maps_api_key`
- EAS Secret: `google_maps_api_key` (se inyecta automaticamente)
- **NO** usar la sintaxis `@nombre` en `eas.json` para secrets de API key (no resuelve correctamente)

## 9. Troubleshooting

### "Install dependencies" falla en EAS Build

Verificar que `.npmrc` exista en la raiz con:
```
legacy-peer-deps=true
```

### Mapa en blanco (solo logo de Google)

1. Verificar que el secret `google_maps_api_key` existe: `npx eas secret:list`
2. Verificar en los build logs que `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` NO sea un literal
3. Verificar SHA-1 en Google Cloud Console coincide con el de EAS
4. Verificar que Maps SDK for Android esta habilitado
5. Verificar que billing esta habilitado
6. Probar sin restricciones en la API key (temporal)

### Build falla despues de upgrade de SDK

```powershell
npx expo prebuild --clean
npx eas build --platform android --profile preview
```

### Peer dependency conflicts

```powershell
npm install --legacy-peer-deps
```

### TypeScript compila localmente pero falla en EAS

Verificar que `tsconfig.json` y `package.json` esten sincronizados. El `.npmrc` con `legacy-peer-deps=true` es necesario para que EAS tambien resuelva los peer deps correctamente.
