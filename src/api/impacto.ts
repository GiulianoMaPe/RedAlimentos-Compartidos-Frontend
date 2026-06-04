import { apiClient } from '@/api/client';
import { ImpactoData } from '@/api/types';

export async function obtenerImpacto(comedorId: number): Promise<ImpactoData> {
  const response = await apiClient.get<ImpactoData>(`/mi-impacto/${comedorId}`);
  return response.data;
}
