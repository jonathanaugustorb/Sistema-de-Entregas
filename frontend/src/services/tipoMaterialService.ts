import api from './api';
import { PageResponse } from '../types/api';
import { TipoMaterial, TipoMaterialRequest } from '../types/entities';

export const tipoMaterialService = {
  listar: (params: { page?: number; size?: number; incluirInativos?: boolean } = {}) =>
    api.get<PageResponse<TipoMaterial>>('/tipos-material', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.incluirInativos ? { incluirInativos: true } : {}),
      },
    }).then((r) => r.data),

  buscarPorId: (id: number) =>
    api.get<TipoMaterial>(`/tipos-material/${id}`).then((r) => r.data),

  criar: (data: TipoMaterialRequest) =>
    api.post<TipoMaterial>('/tipos-material', data).then((r) => r.data),

  atualizar: (id: number, data: TipoMaterialRequest) =>
    api.put<TipoMaterial>(`/tipos-material/${id}`, data).then((r) => r.data),

  inativar: (id: number) =>
    api.patch<void>(`/tipos-material/${id}/inativar`).then((r) => r.data),
};
