import { apiClient } from '@/api/client';
import { Donacion } from '@/api/types';

export async function listarDonaciones(): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>('/donaciones');
  return response.data;
}
