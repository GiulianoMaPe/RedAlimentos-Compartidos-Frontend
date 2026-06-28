import { UbicacionMapa } from '@/api/types';

// Datos mock alrededor de Lima, Perú. Reemplazar por los endpoints reales
// cuando el backend exponga coordenadas (ver requerimiento_ubicaciones_mapa.md).
const PUESTOS_MOCK: UbicacionMapa[] = [
  { id: 1, nombre: 'Frutas Doña María', tipo: 'puesto', latitud: -12.0464, longitud: -77.0428 },
  { id: 2, nombre: 'Verduras El Sol', tipo: 'puesto', latitud: -12.0553, longitud: -77.0365 },
  { id: 3, nombre: 'Mercado Central Puesto 12', tipo: 'puesto', latitud: -12.0508, longitud: -77.0512 },
  { id: 4, nombre: 'Abarrotes San Juan', tipo: 'puesto', latitud: -12.0399, longitud: -77.0301 },
];

const COMEDORES_MOCK: UbicacionMapa[] = [
  { id: 1, nombre: 'Comedor Demo', tipo: 'comedor', latitud: -12.0621, longitud: -77.0365 },
  { id: 2, nombre: 'Comedor Esperanza', tipo: 'comedor', latitud: -12.0432, longitud: -77.0589 },
  { id: 3, nombre: 'Comedor Los Olivos', tipo: 'comedor', latitud: -12.0285, longitud: -77.0447 },
  { id: 4, nombre: 'Comedor San Martín', tipo: 'comedor', latitud: -12.0590, longitud: -77.0250 },
];

export async function listarPuestos(): Promise<UbicacionMapa[]> {
  // TODO(backend): return (await apiClient.get<UbicacionMapa[]>('/puestos')).data;
  return Promise.resolve(PUESTOS_MOCK);
}

export async function listarComedores(): Promise<UbicacionMapa[]> {
  // TODO(backend): return (await apiClient.get<UbicacionMapa[]>('/comedores')).data;
  return Promise.resolve(COMEDORES_MOCK);
}
