import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { TipoViaBadge, AptidaoChuvasBadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/Toast';
import { localidadeService } from '../../../services/localidadeService';
import { Localidade } from '../../../types/entities';
import { ApiError } from '../../../types/api';

export function LocalidadesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [localidades, setLocalidades] = useState<Localidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [buscaInput, setBuscaInput] = useState('');
  const [busca, setBusca] = useState('');
  const [confirmExcluir, setConfirmExcluir] = useState<Localidade | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const primeiroRender = useRef(true);
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    setPage(0);
  }, [busca]);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await localidadeService.listar({ page, busca });
      setLocalidades(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar as localidades. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, busca]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleExcluir = async () => {
    if (!confirmExcluir) return;
    setExcluindo(true);
    try {
      await localidadeService.excluir(confirmExcluir.id);
      showToast('Localidade excluída com sucesso.');
      setConfirmExcluir(null);
      carregar();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao excluir localidade.';
      showToast(msg, 'error');
    } finally {
      setExcluindo(false);
    }
  };

  const columns: Column<Localidade>[] = [
    {
      key: 'endereco',
      header: 'Endereço',
      render: (l) => <span className="text-strong">{l.endereco}</span>,
    },
    {
      key: 'tipoVia',
      header: 'Tipo de Via',
      width: '140px',
      render: (l) => <TipoViaBadge tipo={l.tipoVia} />,
    },
    {
      key: 'aptidaoChuva',
      header: 'Chuva',
      width: '120px',
      render: (l) => <AptidaoChuvasBadge aptidao={l.aptidaoChuva} />,
    },
    {
      key: 'observacoes',
      header: 'Observações',
      render: (l) => l.observacoes ? (
        <span className="text-truncate" title={l.observacoes}>{l.observacoes}</span>
      ) : <span className="text-muted">—</span>,
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '90px',
      render: (l) => (
        <div className="action-buttons">
          <button className="btn-icon-sm" title="Editar" onClick={() => navigate(`/cadastros/localidades/${l.id}/editar`)}>
            <Pencil size={15} />
          </button>
          <button className="btn-icon-sm btn-icon-danger" title="Excluir" onClick={() => setConfirmExcluir(l)}>
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Localidades</h1>
          <p className="page-subtitle">{totalElements} localidade{totalElements !== 1 ? 's' : ''} cadastrada{totalElements !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastros/localidades/novo')}>
          <Plus size={16} /> Nova Localidade
        </button>
      </div>

      <div className="page-filters">
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); setBusca(buscaInput.trim()); }} className="search-form">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input type="text" className="input search-input" placeholder="Buscar por endereço..." value={buscaInput} onChange={(e) => setBuscaInput(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-secondary">Buscar</button>
        </form>
      </div>

      <DataTable
        columns={columns}
        data={localidades}
        loading={loading}
        emptyMessage="Nenhuma localidade cadastrada. Clique em '+ Nova Localidade' para começar."
        totalElements={totalElements}
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!confirmExcluir}
        title="Confirmar Exclusão"
        message={`Deseja excluir a localidade "${confirmExcluir?.endereco}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="danger"
        onConfirm={handleExcluir}
        onCancel={() => setConfirmExcluir(null)}
        loading={excluindo}
      />
    </div>
  );
}
