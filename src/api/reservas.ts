import { apiClient } from '@/api/client';
import {
  ConfirmarEstadoResponse,
  ConfirmarRecojoResponse,
  ReservaPendiente,
  ReservaResponse,
  ResultadoReserva,
} from '@/api/types';

// TODO(backend): eliminar cuando POST /reservar/{id} devuelva codigo_verificacion.
// Ver requerimiento_codigo_verificacion.md en el repo de backend.
const USAR_MOCK_CODIGO = true;

// TODO(backend): eliminar cuando GET /reservas-pendientes devuelva 'estado' e incluya
// reservas en estado 'Validado'. Ver requerimiento_estado_reservas_pendientes.md en backend.
const USAR_MOCK_ESTADO = true;
// Estado simulado para demo. Cambiar a 'Pendiente de Recojo' para ver las estrellas bloqueadas.
const ESTADO_MOCK = 'Validado';

export async function listarReservasPendientes(comedorId: number): Promise<ReservaPendiente[]> {
  const response = await apiClient.get<ReservaPendiente[]>(`/reservas-pendientes/${comedorId}`);
  if (USAR_MOCK_ESTADO) {
    return response.data.map((reserva) => ({ ...reserva, estado: reserva.estado ?? ESTADO_MOCK }));
  }
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
