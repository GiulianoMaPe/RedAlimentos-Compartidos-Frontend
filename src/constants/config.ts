const rawComedorId = Number(process.env.EXPO_PUBLIC_COMEDOR_ID ?? 1);

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/';
export const DEFAULT_COMEDOR_ID = Number.isFinite(rawComedorId) ? rawComedorId : 1;
