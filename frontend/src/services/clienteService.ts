import api from './api';
import { PageResponse } from '../types/api';
import { Cliente, ClienteRequest } from '../types/entities';

interface ListarParams {
  page?: number;
  size?: number;
  busca?: string;
  incluirInativos?: boolean;
}

export const clienteService = {
  listar: (params: ListarParams = {}) =>
    api.get<PageResponse<Cliente>>('/clientes', {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        ...(params.busca ? { busca: params.busca } : {}),
        ...(params.incluirInativos ? { incluirInativos: true } : {}),
      },
    }).then((r) => r.data),

  buscarPorId: (id: number) =>
    api.get<Cliente>(`/clientes/${id}`).then((r) => r.data),

  criar: (data: ClienteRequest) =>
    api.post<Cliente>('/clientes', data).then((r) => r.data),

  atualizar: (id: number, data: ClienteRequest) =>
    api.put<Cliente>(`/clientes/${id}`, data).then((r) => r.data),

  inativar: (id: number) =>
    api.patch<void>(`/clientes/${id}/inativar`).then((r) => r.data),
};
