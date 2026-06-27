import { apiClient } from '@/api/client';
import {
  ConfirmarEstadoResponse,
  ConfirmarRecojoResponse,
  ReservaPendiente,
  ReservaResponse,
  ResultadoReserva,
} from '@/api/types';

export async function listarReservasPendientes(comedorId: number): Promise<ReservaPendiente[]> {
  const response = await apiClient.get<ReservaPendiente[]>(`/reservas-pendientes/${comedorId}`);
  return response.data;
}

export async function reservarDonacion(
  idDonacion: number,
  comedorId: number,
): Promise<ReservaResponse> {
  const response = await apiClient.post<ReservaResponse>(`/reservar/${idDonacion}`, null, {
    params: { comedor_id: comedorId },
  });
  return response.data;
}

// @deprecated Usar confirmarEstadoReserva (POST /reservas/{id}/confirmar). Flujo viejo, sin uso en la UI.
export async function confirmarRecojo(
  idReserva: number,
  puntajeFrescura: number,
  comentario: string,
): Promise<ConfirmarRecojoResponse> {
  const response = await apiClient.post<ConfirmarRecojoResponse>(
    `/confirmar-recojo/${idReserva}`,
    null,
    { params: { puntaje_frescura: puntajeFrescura, comentario: comentario } },
  );
  return response.data;
}

export async function confirmarEstadoReserva(
  idReserva: number,
  resultado: ResultadoReserva,
  puntajeFrescura?: number,
  comentario?: string,
): Promise<ConfirmarEstadoResponse> {
  const response = await apiClient.post<ConfirmarEstadoResponse>(
    `/reservas/${idReserva}/confirmar`,
    {
      resultado,
      puntaje_frescura: puntajeFrescura ?? null,
      comentario: comentario ?? null,
    },
  );
  return response.data;
}
