export interface Donacion {
  id: number;
  descripcion: string;
  cantidad_kg: number;
  estado: string;
  puesto_id: number;
}

export interface DonacionCreatePayload {
  puesto_id: number;
  descripcion: string;
  cantidad_kg: number;
}

export interface Trazabilidad {
  id_trazabilidad: number;
  fecha: string;
  co2: number;
  frescura: number;
}

export interface ImpactoData {
  co2_total: number;
  historial: Trazabilidad[];
}

export interface ReservaPendiente {
  id_reserva: number;
  descripcion: string;
  estado: string;
  codigo_verificacion: string;
}

export interface ReservaResponse {
  status: string;
  mensaje: string;
  id_reserva: number;
  codigo_verificacion: string;
}

export interface ConfirmarRecojoResponse {
  mensaje: string;
  impacto: string;
  puntaje_asignado: number;
  comentario: string | null;
}

export interface ValidarReservaResponse {
  valido: boolean;
  mensaje: string;
}

export type ResultadoReserva = 'Entregado' | 'Rechazado' | 'Cancelado';

export interface DonacionEliminadaResponse {
  mensaje: string;
  id: number;
}

export interface ConfirmarEstadoResponse {
  mensaje: string;
  estado_reserva: string;
  co2_ahorrado_kg: number | null;
}

export interface UbicacionMapa {
  id: number;
  nombre: string;
  tipo: 'puesto' | 'comedor';
  latitud: number;
  longitud: number;
}
