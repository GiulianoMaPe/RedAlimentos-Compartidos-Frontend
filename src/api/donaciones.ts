import { apiClient } from '@/api/client';
import { Donacion, DonacionCreatePayload, DonacionEliminadaResponse, ValidarReservaResponse } from '@/api/types';

export async function listarDonaciones(): Promise<Donacion[]> {
  const response = await apiClient.get<Donacion[]>('/donaciones');
  return response.data;
}

export async function crearDonacion(payload: DonacionCreatePayload): Promise<Donacion> {
  if (payload.imagen) {
    const formData = new FormData();
    formData.append('puesto_id', String(payload.puesto_id));
    formData.append('descripcion', payload.descripcion);
    formData.append('cantidad_kg', String(payload.cantidad_kg));
    if (payload.tiempo_limite) {
      formData.append('tiempo_limite', payload.tiempo_limite);
    }

    const uri = payload.imagen;
    const fileName = uri.split('/').pop() || 'foto.jpg';
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    formData.append('imagen', { uri, name: fileName, type: mimeType } as any);

    const response = await apiClient.post<Donacion>('/donaciones', formData);
    return response.data;
  }

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

export async function eliminarDonacion(id: number): Promise<DonacionEliminadaResponse> {
  const response = await apiClient.delete<DonacionEliminadaResponse>(`/donaciones/${id}`);
  return response.data;
}

export async function validarEntrega(donacionId: number, codigo: string): Promise<ValidarReservaResponse> {
  const response = await apiClient.post<ValidarReservaResponse>(
    `/donaciones/${donacionId}/validar-entrega`,
    { codigo_verificacion: codigo },
  );
  return response.data;
}
