import axios from 'axios';
import { ApiError } from '../types/api';

const api = axios.create({
  // Em desenvolvimento o vite.config.ts faz proxy de /api → localhost:8080
  // Em produção, definir VITE_API_URL com a URL completa do backend
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 15000, // 15s — evita hanging indefinido quando backend está offline
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend retornou resposta com status de erro (4xx / 5xx)
    if (error.response) {
      const { status, data } = error.response;
      const code    = data?.code    ?? 'ERRO_DESCONHECIDO';
      const message = data?.message ?? 'Ocorreu um erro inesperado. Tente novamente.';
      const details = Array.isArray(data?.details) ? data.details : [];
      return Promise.reject(new ApiError(code, message, details, status));
    }

    // Requisição enviada mas sem resposta (backend offline, timeout, CORS bloqueando)
    if (error.request) {
      const isTimeout = error.code === 'ECONNABORTED';
      return Promise.reject(
        new ApiError(
          'CONEXAO_FALHOU',
          isTimeout
            ? 'O servidor demorou demais para responder. Tente novamente.'
            : 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
          [],
          0,
        )
      );
    }

    // Erro de configuração da requisição (bug de código)
    return Promise.reject(new ApiError('ERRO_REQUISICAO', error.message, [], -1));
  }
);

export default api;
