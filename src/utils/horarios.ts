/**
 * Formatea una hora "HH:MM:SS" (o "HH:MM") a formato 12h: "8am", "8:30am", "12pm".
 */
export function formatHora12h(hora: string): string {
  const [hStr, mStr] = hora.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr ?? '0', 10);
  if (isNaN(h)) return hora;
  const sufijo = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m > 0 ? `${h12}:${mStr.padStart(2, '0')}${sufijo}` : `${h12}${sufijo}`;
}

/**
 * Rango de atención legible: "8am - 2pm".
 */
export function formatRangoAtencion(inicio: string, fin: string): string {
  return `${formatHora12h(inicio)} - ${formatHora12h(fin)}`;
}

/**
 * Tiempo restante hasta una fecha ISO, en la unidad más grande relevante:
 * "2 días", "3 horas", "45 minutos" (singular cuando corresponde).
 * Devuelve null si la fecha ya pasó o no es parseable.
 */
export function formatTiempoRestante(fechaISO: string, ahora: Date = new Date()): string | null {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return null;
  const diffMs = fecha.getTime() - ahora.getTime();
  if (diffMs <= 0) return null;

  const minutos = Math.floor(diffMs / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias >= 1) return dias === 1 ? '1 día' : `${dias} días`;
  if (horas >= 1) return horas === 1 ? '1 hora' : `${horas} horas`;
  const m = Math.max(minutos, 1);
  return m === 1 ? '1 minuto' : `${m} minutos`;
}
