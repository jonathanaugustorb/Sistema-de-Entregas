// ─── Enums ────────────────────────────────────────────────────────────────────
export type TipoVia = 'ASFALTADA' | 'NAO_ASFALTADA';
export type AptidaoChuva = 'SIM' | 'NAO' | 'PARCIALMENTE';
export type StatusOperacional = 'ATIVO' | 'INATIVO' | 'MANUTENCAO';

// ─── Cliente ──────────────────────────────────────────────────────────────────
export interface Cliente {
  id: number;
  nome: string;
  enderecoCompleto: string;
  pontoReferencia: string | null;
  telefone: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface ClienteRequest {
  nome: string;
  enderecoCompleto: string;
  pontoReferencia?: string;
  telefone?: string;
}

// ─── Localidade ───────────────────────────────────────────────────────────────
export interface Localidade {
  id: number;
  endereco: string;
  tipoVia: TipoVia;
  aptidaoChuva: AptidaoChuva;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface LocalidadeRequest {
  endereco: string;
  tipoVia: TipoVia;
  aptidaoChuva: AptidaoChuva;
  observacoes?: string;
}

// ─── Motorista ────────────────────────────────────────────────────────────────
export interface Motorista {
  id: number;
  nome: string;
  numeroCnh: string;
  tipoHabilitacao: string;
  veiculoHabitual: string | null;
  contato: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface MotoristaRequest {
  nome: string;
  numeroCnh: string;
  tipoHabilitacao: string;
  veiculoHabitual?: string;
  contato?: string;
}

// ─── Veiculo ──────────────────────────────────────────────────────────────────
export interface Veiculo {
  id: number;
  identificacao: string;
  capacidadeMaxima: number;
  tipoCarroceria: string | null;
  statusOperacional: StatusOperacional;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface VeiculoRequest {
  identificacao: string;
  capacidadeMaxima: number;
  tipoCarroceria?: string;
  statusOperacional: StatusOperacional;
}

// ─── TipoMaterial ─────────────────────────────────────────────────────────────
export interface TipoMaterial {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface TipoMaterialRequest {
  nome: string;
  descricao?: string;
}
