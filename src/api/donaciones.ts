import { apiClient } from '@/api/client';
import { Donacion, DonacionCreatePayload, ValidarReservaResponse } from '@/api/types';

export async function listarDonaciones(): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>('/donaciones');
  return response.data;
}

export async function crearDonacion(payload: DonacionCreatePayload): Promise<Donacion> {
  const response = await apiClient.post<Donacion>('/donaciones', payload);
  return response.data;
}

export async function listarDonacionesPorPuesto(puestoId: number): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>(
    `/donaciones/mis-donaciones/${puestoId}?estados=Disponible,Reservado`
  );
  return response.data;
}

export async function listarHistorialPorPuesto(puestoId: number): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>(
    `/donaciones/mis-donaciones/${puestoId}?estados=Recogido,Cancelado`
  );
  return response.data;
}

export async function validarEntrega(donacionId: number, codigo: string): Promise<ValidarReservaResponse> {
  const response = await apiClient.post<ValidarReservaResponse>(
    `/donaciones/${donacionId}/validar-entrega`,
    { codigo_verificacion: codigo },
  );
  return response.data;
}
