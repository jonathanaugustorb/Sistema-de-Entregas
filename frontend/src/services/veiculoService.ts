import api from './api';
import { PageResponse } from '../types/api';
import { Veiculo, VeiculoRequest, StatusOperacional } from '../types/entities';

export const veiculoService = {
  listar: (params: { page?: number; size?: number; status?: StatusOperacional } = {}) =>
    api.get<PageResponse<Veiculo>>('/veiculos', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.status ? { status: params.status } : {}),
      },
    }).then((r) => r.data),

  buscarPorId: (id: number) =>
    api.get<Veiculo>(`/veiculos/${id}`).then((r) => r.data),

  criar: (data: VeiculoRequest) =>
    api.post<Veiculo>('/veiculos', data).then((r) => r.data),

  atualizar: (id: number, data: VeiculoRequest) =>
    api.put<Veiculo>(`/veiculos/${id}`, data).then((r) => r.data),
};
