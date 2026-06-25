import { apiClient } from '@/api/client';
import { ConfirmarRecojoResponse, ReservaPendiente, ReservaResponse } from '@/api/types';

// TODO(backend): eliminar cuando POST /reservar/{id} devuelva codigo_verificacion.
// Ver requerimiento_codigo_verificacion.md en el repo de backend.
const USAR_MOCK_CODIGO = true;

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
  const data = response.data;

  if (USAR_MOCK_CODIGO && !data.codigo_verificacion) {
    return { ...data, codigo_verificacion: String(Math.floor(100000 + Math.random() * 900000)) };
  }
  return data;
}

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
