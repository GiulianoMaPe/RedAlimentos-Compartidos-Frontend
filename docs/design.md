---
version: alpha
name: FoodLinks
description: Sistema de diseño para FoodLinks, la app móvil que conecta comerciantes de mercado con comedores comunitarios para redistribuir excedentes de alimentos.

colors:
  primary: "#1E5631"
  primary-hover: "#174527"
  primary-pressed: "#0F2F1B"
  on-primary: "#FFFFFF"
  primary-container: "#E3EDE2"
  on-primary-container: "#153D22"

  accent: "#E87A2C"
  accent-hover: "#CC661D"
  accent-pressed: "#A85212"
  on-accent: "#FFFFFF"
  accent-container: "#FDEEE0"
  on-accent-container: "#7A3A08"

  background: "#FFFFFF"
  surface: "#F4F7F2"
  surface-variant: "#E3EDE2"
  on-surface: "#131A12"
  on-surface-variant: "#5A6657"
  on-surface-muted: "#8A9686"

  inverse-surface: "#404C3B"
  on-inverse-surface: "#F1F4EF"

  outline: "#D3DCD0"
  outline-focus: "#1E5631"

  success: "#2E7D4F"
  on-success: "#FFFFFF"
  success-container: "#E2F1E8"
  on-success-container: "#17492D"

  warning: "#B26A00"
  on-warning: "#FFFFFF"
  warning-container: "#FBEEDA"
  on-warning-container: "#6B3F00"

  error: "#B3261E"
  on-error: "#FFFFFF"
  error-container: "#FBE7E5"
  on-error-container: "#6E1811"

  info: "#2F6F8F"
  on-info: "#FFFFFF"
  info-container: "#E4F0F5"
  on-info-container: "#1B4356"

  neutral-container: "#EDEFEC"
  on-neutral-container: "#5A6657"

  disabled: "#E4E8E2"
  on-disabled: "#A3ADA1"

typography:
  display:
    fontFamily: Poppins
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  h1:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Poppins
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  h3:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  body-strong:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.45
  caption:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.06em
  numeric:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "tnum"
  button:
    fontFamily: Poppins
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 999px

spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-primary-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.on-disabled}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-secondary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.3}"
    height: 44px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.error}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 52px
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 44px
  icon-button-pressed:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    rounded: "{rounded.full}"
    size: 44px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 48px
  input-focus:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 48px
  input-error:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 48px
  input-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.on-disabled}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "{spacing.4}"
    height: 48px
  chip-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "{spacing.3}"
    height: 36px
  chip-filter-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "{spacing.3}"
    height: 36px
  chip-quantity:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.numeric}"
    rounded: "{rounded.full}"
    padding: "{spacing.3}"
    height: 32px
  badge-disponible:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-reservado:
    backgroundColor: "{colors.info-container}"
    textColor: "{colors.on-info-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-pendiente-recojo:
    backgroundColor: "{colors.accent-container}"
    textColor: "{colors.on-accent-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-validado:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-completada:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-recogido:
    backgroundColor: "{colors.neutral-container}"
    textColor: "{colors.on-neutral-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-cancelado:
    backgroundColor: "{colors.neutral-container}"
    textColor: "{colors.on-neutral-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  badge-rechazado:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 24px
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  card-lot:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  card-lot-urgent:
    backgroundColor: "{colors.accent-container}"
    textColor: "{colors.on-accent-container}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.4}"
  card-impact:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.on-inverse-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "{spacing.6}"
  countdown-calm:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 26px
  countdown-soon:
    backgroundColor: "{colors.accent-container}"
    textColor: "{colors.on-accent-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 26px
  countdown-critical:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "{spacing.2}"
    height: 26px
  stepper:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.numeric}"
    rounded: "{rounded.full}"
    height: 36px
  tab-bar-item:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    height: 56px
  tab-bar-item-active:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    height: 56px
  app-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.h3}"
    rounded: "{rounded.none}"
    padding: "{spacing.4}"
    height: 64px
  verification-code:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.display}"
    rounded: "{rounded.lg}"
    padding: "{spacing.6}"
  empty-state:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.8}"
  toast-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
  toast-error:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "{spacing.4}"
---

# FoodLinks Design System

## Overview

FoodLinks conecta comerciantes de mercado que tienen excedentes de alimentos con comedores comunitarios que los necesitan. Dos roles usan la misma app en móvil, varias veces al día, casi siempre de pie y con prisa: el comerciante publica un lote antes de cerrar el puesto, el gestor de comedor lo reserva y coordina el recojo antes de que el alimento se pierda.

El sistema debe sentirse **confiable, cálido y claro**. Confiable porque hay comida, dinero implícito y compromisos entre personas reales de por medio. Cálido porque no es logística fría: es una red vecinal. Claro porque el tiempo es el recurso escaso — un lote con `tiempo_limite` vencido no sirve a nadie.

La estética es orgánica y respirada: verde profundo, superficies salvia, formas totalmente redondeadas, cero sombras duras. Esto **nunca** debe convertirse en un dashboard corporativo de densidad alta, ni en una app de e-commerce que trate los alimentos donados como producto de vitrina, ni en un panel de datos que esconda la urgencia detrás de tablas.

## Colors

`primary` (`#1E5631`) es un verde bosque profundo: es el color de la marca, de la acción principal y de todo lo que confirma. Se usa en botones sólidos, en el wordmark del header y en el estado activo del tab bar. Su par `on-primary` es blanco puro, con contraste 9.3:1 — cómodo por encima de AA incluso en texto de 15px.

`primary-container` (`#E3EDE2`) es el verde salvia claro que hace de superficie de tarjeta. Es el que carga la jerarquía: en vez de sombras, una tarjeta se separa del fondo blanco por ser salvia. `surface` (`#F4F7F2`) es un escalón aún más tenue, para fondos de pantalla e íconos circulares del header.

`accent` (`#E87A2C`) es el naranja del logo y tiene **un solo trabajo: la urgencia temporal**. Aparece en el contador de `tiempo_limite` cuando quedan pocas horas, en el badge de `Pendiente de Recojo` y en llamadas a la acción que el usuario no debe postergar. No es un segundo color de marca de uso libre — si el naranja aparece en todas partes, deja de significar "esto vence pronto" y el sistema pierde su señal más importante.

Los semánticos mapean directo a los estados del dominio: `success` para `Disponible` y `Completada`, `info` para `Reservado` y `Validado`, `accent` para `Pendiente de Recojo`, `error` para `Rechazado`, y `neutral-container` para lo que ya cerró sin drama (`Recogido`, `Cancelado`). Todos los pares container/on-container superan 4.5:1.

`inverse-surface` (`#404C3B`) es el verde grisáceo oscuro de las secciones de cierre — footer y tarjeta de impacto de CO₂. Da peso al final de una pantalla sin recurrir a negro.

## Typography

**Poppins** en toda la app. Es una sans geométrica de terminaciones redondeadas: su carácter amable evita que una app de logística se sienta burocrática, y su construcción circular rima con el lenguaje pill de los componentes. Soporta acentos y `ñ` sin problema, y carga vía `expo-font`.

La escala tiene tres zonas. **Display y h1–h3** son el andamiaje de pantalla, siempre en 600–700 con `letter-spacing` negativo — Poppins en bold y tamaño grande se abre demasiado, y apretarlo la vuelve más editorial y menos infantil. **Body-lg / body / body-strong / caption** son el texto corrido, en 400 con line-height 1.55 para que las descripciones de lote de hasta 500 caracteres sigan siendo legibles.

**`numeric`** es su propio nivel y es deliberado: kilos, cantidades y el código de verificación necesitan `font-feature: tnum` para que los dígitos no bailen al actualizarse un contador. **`label`** va en mayúsculas con `letter-spacing` de 0.06em y se reserva para badges de estado y encabezados de sección pequeños.

Nunca usar serif ni display decorativa. Nunca bajar de 12px.

## Layout

Escala de espaciado en múltiplos de 4px, de `spacing.1` (4px) a `spacing.16` (64px). La densidad es **generosa**: 16px de margen lateral de pantalla, 16px de padding interno de tarjeta, 24px entre bloques relacionados y 32–48px entre secciones distintas.

Esto cuesta scroll y es una decisión consciente: los listados de donaciones muestran menos ítems por pantalla, pero cada tarjeta de lote es un compromiso real que alguien va a aceptar, y merece espacio para leerse sin error. Donde la densidad sí importa —listados largos de historial— se usa la variante compacta de tarjeta, no una reducción global del sistema.

Grid de una columna en las pantallas de flujo (publicar, reservar, confirmar) y de dos columnas con gutter de 12px en las de exploración visual, siguiendo el catálogo de la referencia. El ancho de contenido se limita a 480px y se centra, para que la app siga funcionando en tablet y en web sin estirarse.

## Elevation & Depth

El sistema es **casi plano y se apoya en contraste de superficie**, no en sombras. La jerarquía se construye en tres capas: `background` blanco al fondo, `surface`/`surface-variant` salvia para lo que flota, `outline` de 1px cuando dos elementos del mismo tono se tocan.

Solo hay dos excepciones con sombra real, y ambas son elementos que de verdad se superponen al contenido: modales/bottom sheets (`0 8px 24px rgba(19,26,18,0.12)`) y toasts (`0 4px 12px rgba(19,26,18,0.10)`). Las tarjetas nunca llevan sombra.

Esto mantiene la sensación de papel y calma de las referencias, y tiene un beneficio práctico: las sombras en React Native se comportan distinto en iOS y Android, y evitarlas elimina una fuente clásica de deriva visual entre plataformas.

## Shapes

Radio generoso en todo. Los controles interactivos —botones, inputs, chips, badges, steppers, botones de ícono— son **pill completo** (`rounded.full`). Los contenedores —tarjetas, estados vacíos, bloque de código de verificación— usan `rounded.lg` (16px). Los contenedores grandes de cierre, como la tarjeta de impacto, usan `rounded.xl` (24px).

La regla es legible de un vistazo: **si es pill, es tocable; si tiene esquina de 16px, es contenido**. Eso le da al usuario una señal de affordance sin depender de color ni de sombra.

El único 0px del sistema es el header y el tab bar, que son barras de borde a borde. Las imágenes de lote heredan `rounded.md` (12px) para que el recorte no compita con la tarjeta que las contiene.

## Components

**Botones.** `button-primary` es la única acción sólida verde por pantalla: publicar lote, reservar, confirmar recojo. `button-secondary` es contorno verde de 1.5px para la alternativa secundaria. `button-accent` existe solo para acciones ligadas a urgencia real. `button-destructive` es texto rojo sobre fondo blanco con borde — cancelar una reserva es reversible en consecuencias sociales pero no en la base de datos, así que se ve claramente pero nunca compite visualmente con la acción principal. Altura 52px, muy por encima del target táctil de 44px, porque se usa con prisa.

**Inputs.** Pill de 48px con borde `outline` de 1px. En foco el borde pasa a `outline-focus` de 2px, sin glow. En error, borde `error` más un texto de ayuda de 12px debajo — el color nunca es el único portador del mensaje.

**Badges de estado.** Un badge por cada estado del dominio, con el color semántico ya asignado en los tokens. Siempre llevan el texto del estado en `label`: un usuario daltónico distingue `Disponible` de `Rechazado` por la palabra, no por el verde y el rojo.

**Tarjeta de lote (`card-lot`).** Es el componente central de la app. Foto a 12px de radio, descripción en `body-strong` a dos líneas máximo, kilos en `numeric`, nombre del puesto en `caption`, badge de estado y contador de urgencia. Cuando el `tiempo_limite` entra en zona crítica, la tarjeta cambia a `card-lot-urgent` con fondo `accent-container`.

**Contador de urgencia.** Tres niveles derivados de `tiempo_limite`: `countdown-calm` (más de 6h restantes, gris-verde), `countdown-soon` (2–6h, naranja), `countdown-critical` (menos de 2h, rojo). Es la única parte del sistema donde el color escala con el tiempo, y por eso el naranja está reservado.

**Código de verificación.** El `codigo_verificacion` del recojo se muestra en `display` sobre `primary-container`, con espaciado amplio entre caracteres, pensado para leerse en voz alta o mostrarse en pantalla a un metro de distancia.

**Estados vacíos.** Nunca una pantalla en blanco. Ícono, una frase de qué falta y un botón que lleva a la acción que la resuelve.

## Do's and Don'ts

**Do's**

- Usa `primary` para la acción de confirmación y reserva `accent` exclusivamente para urgencia temporal.
- Acompaña siempre el color de estado con su etiqueta de texto — el color solo nunca comunica el estado.
- Construye jerarquía con superficies (`background` → `surface` → `surface-variant`), no con sombras.
- Mantén una sola acción primaria sólida por pantalla; todo lo demás es secundario o ghost.
- Usa `typography.numeric` para kilos, cantidades, contadores y códigos, para que los dígitos no salten.
- Respeta la escala de 4px: cualquier espaciado fuera de los tokens es un bug, no una decisión.

**Don'ts**

- No uses el naranja como segundo color de marca decorativo — mata la señal de urgencia.
- No pongas sombras en tarjetas ni compenses jerarquía débil subiendo elevación.
- No mezcles radios: si es tocable es pill, si es contenido es 16px. Nada de 6px sueltos.
- No compactes el espaciado para meter más lotes por pantalla; usa la variante compacta de tarjeta.
- No uses el logo con el glow difuso ni el wordmark en outline sobre fondo claro — solo la versión sólida.
- No introduzcas serif, tamaños bajo 12px, ni mayúsculas fuera de `typography.label`.
