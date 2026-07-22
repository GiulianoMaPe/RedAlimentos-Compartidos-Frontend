# Frontend - FoodLinks (Mobile App)

Esta es la aplicación móvil diseñada para los Gestores de Comedores y Puestos de Mercado. Está construida con **React Native** usando el framework **Expo** (SDK 56).

## Requisitos Previos
1. Instalar **Node.js** (LTS) en tu computadora.
2. Descargar la aplicación **Expo Go** en tu celular (desde la Play Store o App Store).
3. Tu celular y tu computadora **deben estar conectados a la misma red Wi-Fi**.

## Instrucciones de Configuración Local

**Paso 1: Clonar el repositorio y entrar a la carpeta**
\`\`\`bash
git clone <URL_DE_TU_REPOSITORIO_FRONTEND>
cd RedAlimentos-Frontend
\`\`\`

**Paso 2: Instalar las dependencias**
Instala todas las librerías necesarias ejecutando:
\`\`\`bash
npm install
\`\`\`
*(Nota: Si te da un error de dependencias conflictivas, usa `npm install --legacy-peer-deps`).*

**Paso 3: Configurar la Conexión al Backend (Variables de Entorno)**
Para que la app encuentre el servidor de Python, necesitamos decirle tu IP local.
1. Crea un archivo llamado **`.env`** en la raíz de esta carpeta (al mismo nivel que `package.json`).
2. Averigua tu IP local (escribe `ipconfig` en Windows o `ifconfig` en Mac).
3. Pega esta línea en tu archivo `.env`, reemplazando las 'X' con tu IP real:
   \`\`\`text
   EXPO_PUBLIC_API_URL=http://192.168.1.X:8000/
   \`\`\`
*(No subas este archivo a GitHub, es solo para tu computadora).*

**Paso 4: Iniciar la aplicación limpia**
\`\`\`bash
npx expo start -c
\`\`\`

**Paso 5: ¡Probar en el celular!**
1. Asegúrate de que el Backend de Python esté corriendo en otra terminal.
2. Escanea el código QR que apareció en la terminal usando la app **Expo Go** en tu celular.
3. ¡Deberías ver la lista de donaciones en pantalla!