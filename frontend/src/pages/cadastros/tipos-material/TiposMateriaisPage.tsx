import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Ban } from 'lucide-react';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { Ativobadge } from '../../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/Toast';
import { tipoMaterialService } from '../../../services/tipoMaterialService';
import { TipoMaterial } from '../../../types/entities';
import { ApiError } from '../../../types/api';

export function TiposMateriaisPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [materiais, setMateriais] = useState<TipoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [incluirInativos, setIncluirInativos] = useState(false);
  const [confirmInativar, setConfirmInativar] = useState<TipoMaterial | null>(null);
  const [inativando, setInativando] = useState(false);

  const primeiroRender = useRef(true);
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return; }
    setPage(0);
  }, [incluirInativos]);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tipoMaterialService.listar({ page, incluirInativos });
      setMateriais(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Não foi possível carregar os tipos de material. Verifique sua conexão.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, incluirInativos]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleInativar = async () => {
    if (!confirmInativar) return;
    setInativando(true);
    try {
      await tipoMaterialService.inativar(confirmInativar.id);
      showToast(`"${confirmInativar.nome}" inativado com sucesso.`);
      setConfirmInativar(null);
      carregar();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Erro ao inativar.', 'error');
    } finally {
      setInativando(false);
    }
  };

  const columns: Column<TipoMaterial>[] = [
    { key: 'nome', header: 'Nome', render: (m) => <span className="text-strong">{m.nome}</span> },
    { key: 'descricao', header: 'Descrição', render: (m) => m.descricao ?? <span className="text-muted">—</span> },
    { key: 'status', header: 'Status', width: '100px', render: (m) => <Ativobadge ativo={m.ativo} /> },
    {
      key: 'acoes', header: 'Ações', width: '90px',
      render: (m) => (
        <div className="action-buttons">
          <button className="btn-icon-sm" title="Editar" onClick={() => navigate(`/cadastros/tipos-material/${m.id}/editar`)}><Pencil size={15} /></button>
          {m.ativo && <button className="btn-icon-sm btn-icon-danger" title="Inativar" onClick={() => setConfirmInativar(m)}><Ban size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tipos de Material</h1>
          <p className="page-subtitle">{totalElements} tipo{totalElements !== 1 ? 's' : ''} cadastrado{totalElements !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cadastros/tipos-material/novo')}><Plus size={16} /> Novo Tipo</button>
      </div>
      <div className="page-filters">
        <label className="toggle-label"><input type="checkbox" checked={incluirInativos} onChange={(e) => { setIncluirInativos(e.target.checked); setPage(0); }} />Mostrar inativos</label>
      </div>
      <DataTable columns={columns} data={materiais} loading={loading} emptyMessage="Nenhum tipo de material cadastrado." totalElements={totalElements} totalPages={totalPages} page={page} onPageChange={setPage} />
      <ConfirmDialog open={!!confirmInativar} title="Confirmar Inativação" message={`Deseja inativar o tipo "${confirmInativar?.nome}"?`} confirmLabel="Inativar" variant="danger" onConfirm={handleInativar} onCancel={() => setConfirmInativar(null)} loading={inativando} />
    </div>
  );
}
