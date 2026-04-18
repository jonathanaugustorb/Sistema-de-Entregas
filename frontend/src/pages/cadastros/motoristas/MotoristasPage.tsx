import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Ban } from 'lucide-react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Ativobadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/Toast';
import { motoristaService } from '../../../services/motoristaService';
import { Motorista } from '../../../types/entities';
import { ApiError } from '../../../types/api';

export function MotoristasPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [buscaInput, setBuscaInput] = useState('');
  const [busca, setBusca] = useState('');
  const [incluirInativos, setIncluirInativos] = useState(false);
  const [confirmInativar, setConfirmInativar] = useState<Motorista | null>(null);
  const [inativando, setInativando] = useState(false);

  const primeiroRender = useRef(true);
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    setPage(0);
  }, [busca, incluirInativos]);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await motoristaService.listar({ page, busca, incluirInativos });
      setMotoristas(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar os motoristas. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, busca, incluirInativos]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleInativar = async () => {
    if (!confirmInativar) return;
    setInativando(true);
    try {
      await motoristaService.inativar(confirmInativar.id);
      showToast(`Motorista "${confirmInativar.nome}" inativado com sucesso.`);
      setConfirmInativar(null);
      carregar();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Erro ao inativar motorista.', 'error');
    } finally {
      setInativando(false);
    }
  };

  const columns: Column<Motorista>[] = [
    { key: 'nome', header: 'Nome', render: (m) => <span className="text-strong">{m.nome}</span> },
    { key: 'cnh', header: 'CNH', render: (m) => <span className="text-mono">{m.numeroCnh}</span> },
    { key: 'hab', header: 'Habilitação', width: '100px', render: (m) => <span className="badge badge-info">{m.tipoHabilitacao}</span> },
    { key: 'contato', header: 'Contato', render: (m) => m.contato ?? <span className="text-muted">—</span> },
    { key: 'status', header: 'Status', width: '100px', render: (m) => <Ativobadge ativo={m.ativo} /> },
    {
      key: 'acoes', header: 'Ações', width: '90px',
      render: (m) => (
        <div className="action-buttons">
          <button className="btn-icon-sm" title="Editar" onClick={() => navigate(`/cadastros/motoristas/${m.id}/editar`)}><Pencil size={15} /></button>
          {m.ativo && <button className="btn-icon-sm btn-icon-danger" title="Inativar" onClick={() => setConfirmInativar(m)}><Ban size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Motoristas</h1>
          <p className="page-subtitle">{totalElements} motorista{totalElements !== 1 ? 's' : ''} cadastrado{totalElements !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastros/motoristas/novo')}><Plus size={16} /> Novo Motorista</button>
      </div>
      <div className="page-filters">
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); setBusca(buscaInput.trim()); }} className="search-form">
          <div className="search-input-wrap"><Search size={16} className="search-icon" /><input type="text" className="input search-input" placeholder="Buscar por nome..." value={buscaInput} onChange={(e) => setBuscaInput(e.target.value)} /></div>
          <button type="submit" className="btn btn-secondary">Buscar</button>
        </form>
        <label className="toggle-label"><input type="checkbox" checked={incluirInativos} onChange={(e) => { setIncluirInativos(e.target.checked); setPage(0); }} />Mostrar inativos</label>
      </div>
      <DataTable columns={columns} data={motoristas} loading={loading} emptyMessage="Nenhum motorista cadastrado." totalElements={totalElements} totalPages={totalPages} page={page} onPageChange={setPage} />
      <ConfirmDialog open={!!confirmInativar} title="Confirmar Inativação" message={`Deseja inativar o motorista "${confirmInativar?.nome}"?`} confirmLabel="Inativar" variant="danger" onConfirm={handleInativar} onCancel={() => setConfirmInativar(null)} loading={inativando} />
    </div>
  );
}
