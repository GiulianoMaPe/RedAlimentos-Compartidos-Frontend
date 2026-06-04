import { apiClient } from '@/api/client';
import { ConfirmarRecojoResponse, ReservaPendiente, ReservaResponse } from '@/api/types';

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

export async function confirmarRecojo(
  idReserva: number,
  puntajeFrescura: number,
): Promise<ConfirmarRecojoResponse> {
  const response = await apiClient.post<ConfirmarRecojoResponse>(
    `/confirmar-recojo/${idReserva}`,
    null,
    { params: { puntaje_frescura: puntajeFrescura } },
  );
  return response.data;
}
