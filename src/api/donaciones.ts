import { apiClient } from '@/api/client';
import { Donacion, DonacionCreatePayload } from '@/api/types';

export async function listarDonaciones(): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>('/donaciones');
  return response.data;
}

export async function crearDonacion(payload: DonacionCreatePayload): Promise<Donacion> {
  const response = await apiClient.post<Donacion>('/donaciones', payload);
  return response.data;
}
