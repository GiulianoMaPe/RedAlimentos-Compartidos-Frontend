export interface Donacion {
  id: number;
  descripcion: string;
  estado: string;
  puesto_id: number;
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
}

export interface ReservaResponse {
  status: string;
  mensaje: string;
  id_reserva: number;
}

export interface ConfirmarRecojoResponse {
  mensaje: string;
  impacto: string;
  puntaje_asignado: number;
}
