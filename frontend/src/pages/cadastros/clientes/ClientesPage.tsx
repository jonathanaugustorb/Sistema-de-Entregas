import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Ban, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Ativobadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/Toast';
import { clienteService } from '../../../services/clienteService';
import { Cliente } from '../../../types/entities';
import { ApiError } from '../../../types/api';

export function ClientesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [busca, setBusca] = useState('');
  const [buscaInput, setBuscaInput] = useState('');
  const [incluirInativos, setIncluirInativos] = useState(false);
  const [confirmInativar, setConfirmInativar] = useState<Cliente | null>(null);
  const [inativando, setInativando] = useState(false);

  // Garante que mudança de filtros sempre volta para a página 0
  const primeiroRender = useRef(true);
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    setPage(0);
  }, [busca, incluirInativos]);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErroCarregamento(false);
    try {
      const data = await clienteService.listar({ page, busca, incluirInativos });
      setClientes(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setErroCarregamento(true);
      const msg = err instanceof ApiError ? err.message : 'Não foi possível carregar os clientes. Verifique sua conexão.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, busca, incluirInativos]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const termo = buscaInput.trim();
    if (termo === busca) { carregar(); return; } // forçar reload mesmo termo
    setBusca(termo);
  };

  const handleInativar = async () => {
    if (!confirmInativar) return;
    setInativando(true);
    try {
      await clienteService.inativar(confirmInativar.id);
      showToast(`Cliente "${confirmInativar.nome}" inativado com sucesso.`);
      setConfirmInativar(null);
      carregar();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Erro ao inativar cliente.', 'error');
    } finally {
      setInativando(false);
    }
  };

  const columns: Column<Cliente>[] = [
    {
      key: 'nome',
      header: 'Nome',
      render: (c) => <span className="text-strong">{c.nome}</span>,
    },
    {
      key: 'telefone',
      header: 'Telefone',
      render: (c) => c.telefone ?? <span className="text-muted">—</span>,
    },
    {
      key: 'endereco',
      header: 'Endereço',
      render: (c) => (
        <span className="text-truncate" title={c.enderecoCompleto}>
          {c.enderecoCompleto}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (c) => <Ativobadge ativo={c.ativo} />,
    },
    {
      key: 'acoes',
      header: 'Ações',
      width: '90px',
      render: (c) => (
        <div className="action-buttons">
          <button
            className="btn-icon-sm"
            title="Editar"
            onClick={() => navigate(`/cadastros/clientes/${c.id}/editar`)}
          >
            <Pencil size={15} />
          </button>
          {c.ativo && (
            <button
              className="btn-icon-sm btn-icon-danger"
              title="Inativar"
              onClick={() => setConfirmInativar(c)}
            >
              <Ban size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">
            {totalElements} cliente{totalElements !== 1 ? 's' : ''} cadastrado{totalElements !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {erroCarregamento && (
            <button className="btn btn-secondary" onClick={carregar} title="Tentar novamente">
              <RefreshCw size={15} /> Tentar novamente
            </button>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/cadastros/clientes/novo')}>
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="page-filters">
        <form onSubmit={handleBuscar} className="search-form">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Buscar por nome..."
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Buscar</button>
        </form>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={incluirInativos}
            onChange={(e) => setIncluirInativos(e.target.checked)}
          />
          Mostrar inativos
        </label>
      </div>

      <DataTable
        columns={columns}
        data={clientes}
        loading={loading}
        emptyMessage={
          busca
            ? `Nenhum cliente encontrado para "${busca}".`
            : 'Nenhum cliente cadastrado. Clique em "+ Novo Cliente" para começar.'
        }
        totalElements={totalElements}
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!confirmInativar}
        title="Confirmar Inativação"
        message={`Deseja inativar o cliente "${confirmInativar?.nome}"? O histórico será preservado e o cliente não receberá novos agendamentos.`}
        confirmLabel="Inativar"
        variant="danger"
        onConfirm={handleInativar}
        onCancel={() => setConfirmInativar(null)}
        loading={inativando}
      />
    </div>
  );
}
