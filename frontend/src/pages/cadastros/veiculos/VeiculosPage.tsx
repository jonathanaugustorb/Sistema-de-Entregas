import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { StatusOperacionalBadge } from '../../../components/ui/StatusBadge';
import { useToast } from '../../../components/ui/Toast';
import { veiculoService } from '../../../services/veiculoService';
import { Veiculo, StatusOperacional } from '../../../types/entities';
import { ApiError } from '../../../types/api';

export function VeiculosPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<StatusOperacional | ''>('');

  const primeiroRender = useRef(true);
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    setPage(0);
  }, [filtroStatus]);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await veiculoService.listar({ page, ...(filtroStatus ? { status: filtroStatus } : {}) });
      setVeiculos(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar os veículos. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, filtroStatus]);

  useEffect(() => { carregar(); }, [carregar]);

  const columns: Column<Veiculo>[] = [
    { key: 'id', header: 'Identificação', render: (v) => <span className="text-strong text-mono">{v.identificacao}</span> },
    { key: 'capacidade', header: 'Capacidade (t)', width: '130px', render: (v) => `${v.capacidadeMaxima.toFixed(2)} t` },
    { key: 'carroceria', header: 'Carroceria', render: (v) => v.tipoCarroceria ?? <span className="text-muted">—</span> },
    { key: 'status', header: 'Status', width: '130px', render: (v) => <StatusOperacionalBadge status={v.statusOperacional} /> },
    {
      key: 'acoes', header: 'Ações', width: '60px',
      render: (v) => (
        <div className="action-buttons">
          <button className="btn-icon-sm" title="Editar" onClick={() => navigate(`/cadastros/veiculos/${v.id}/editar`)}><Pencil size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Veículos</h1>
          <p className="page-subtitle">{totalElements} veículo{totalElements !== 1 ? 's' : ''} cadastrado{totalElements !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastros/veiculos/novo')}><Plus size={16} /> Novo Veículo</button>
      </div>
      <div className="page-filters">
        <div className="filter-row">
          <label className="form-label">Status:</label>
          <select className="input input-sm" value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value as any); setPage(0); }}>
            <option value="">Todos</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="MANUTENCAO">Em Manutenção</option>
          </select>
        </div>
      </div>
      <DataTable columns={columns} data={veiculos} loading={loading} emptyMessage="Nenhum veículo cadastrado." totalElements={totalElements} totalPages={totalPages} page={page} onPageChange={setPage} />
    </div>
  );
}
