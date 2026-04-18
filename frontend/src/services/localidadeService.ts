import api from './api';
import { PageResponse } from '../types/api';
import { Localidade, LocalidadeRequest } from '../types/entities';

export const localidadeService = {
  listar: (params: { page?: number; size?: number; busca?: string } = {}) =>
    api.get<PageResponse<Localidade>>('/localidades', {
      params: { page: params.page ?? 0, size: params.size ?? 10, ...(params.busca ? { busca: params.busca } : {}) },
    }).then((r) => r.data),

  buscarPorId: (id: number) =>
    api.get<Localidade>(`/localidades/${id}`).then((r) => r.data),

  criar: (data: LocalidadeRequest) =>
    api.post<Localidade>('/localidades', data).then((r) => r.data),

  atualizar: (id: number, data: LocalidadeRequest) =>
    api.put<Localidade>(`/localidades/${id}`, data).then((r) => r.data),

  excluir: (id: number) =>
    api.delete<void>(`/localidades/${id}`).then((r) => r.data),
};
