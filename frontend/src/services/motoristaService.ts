import api from './api';
import { PageResponse } from '../types/api';
import { Motorista, MotoristaRequest } from '../types/entities';

export const motoristaService = {
  listar: (params: { page?: number; size?: number; busca?: string; incluirInativos?: boolean } = {}) =>
    api.get<PageResponse<Motorista>>('/motoristas', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.busca ? { busca: params.busca } : {}),
        ...(params.incluirInativos ? { incluirInativos: true } : {}),
      },
    }).then((r) => r.data),

  buscarPorId: (id: number) =>
    api.get<Motorista>(`/motoristas/${id}`).then((r) => r.data),

  criar: (data: MotoristaRequest) =>
    api.post<Motorista>('/motoristas', data).then((r) => r.data),

  atualizar: (id: number, data: MotoristaRequest) =>
    api.put<Motorista>(`/motoristas/${id}`, data).then((r) => r.data),

  inativar: (id: number) =>
    api.patch<void>(`/motoristas/${id}/inativar`).then((r) => r.data),
};
