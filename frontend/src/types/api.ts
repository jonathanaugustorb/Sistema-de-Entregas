export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ErroDetalhe {
  field: string;
  message: string;
}

export interface ErroResponse {
  code: string;
  message: string;
  details: ErroDetalhe[];
}

export class ApiError extends Error {
  code: string;
  details: ErroDetalhe[];
  status: number;

  constructor(code: string, message: string, details: ErroDetalhe[], status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
