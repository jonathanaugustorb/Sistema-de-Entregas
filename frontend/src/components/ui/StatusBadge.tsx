import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'badge-info',
};

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span className={`badge ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}

// ─── Helpers de conveniência ──────────────────────────────────────────────────

export function Ativobadge({ ativo }: { ativo: boolean }) {
  return (
    <StatusBadge
      label={ativo ? 'ATIVO' : 'INATIVO'}
      variant={ativo ? 'success' : 'danger'}
    />
  );
}

export function StatusOperacionalBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    ATIVO: { label: 'ATIVO', variant: 'success' },
    INATIVO: { label: 'INATIVO', variant: 'danger' },
    MANUTENCAO: { label: 'MANUTENÇÃO', variant: 'info' },
  };
  const cfg = map[status] ?? { label: status, variant: 'info' as BadgeVariant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}

export function TipoViaBadge({ tipo }: { tipo: string }) {
  return (
    <StatusBadge
      label={tipo === 'ASFALTADA' ? 'ASFALTADA' : 'NÃO ASFALTADA'}
      variant={tipo === 'ASFALTADA' ? 'success' : 'warning'}
    />
  );
}

export function AptidaoChuvasBadge({ aptidao }: { aptidao: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    SIM: { label: 'APTO', variant: 'success' },
    NAO: { label: 'RESTRITO', variant: 'danger' },
    PARCIALMENTE: { label: 'PARCIAL', variant: 'warning' },
  };
  const cfg = map[aptidao] ?? { label: aptidao, variant: 'info' as BadgeVariant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}
