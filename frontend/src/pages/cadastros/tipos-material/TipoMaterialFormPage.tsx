import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';
import { useToast } from '../../../components/ui/Toast';
import { tipoMaterialService } from '../../../services/tipoMaterialService';
import { ApiError } from '../../../types/api';

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function TipoMaterialFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingData, setLoadingData] = useState(isEditing);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isEditing) return;
    tipoMaterialService.buscarPorId(Number(id))
      .then((m) => reset({ nome: m.nome, descricao: m.descricao ?? '' }))
      .catch(() => showToast('Erro ao carregar dados.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing, reset, showToast]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const payload = { nome: data.nome, descricao: data.descricao || undefined };
      if (isEditing) {
        await tipoMaterialService.atualizar(Number(id), payload);
        showToast('Tipo de material atualizado!');
      } else {
        await tipoMaterialService.criar(payload);
        showToast('Tipo de material cadastrado!');
      }
      navigate('/cadastros/tipos-material');
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Erro inesperado.');
    }
  };

  if (loadingData) return <div className="page"><p className="text-muted">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Tipo de Material' : 'Novo Tipo de Material'}</h1>
          <p className="page-subtitle">{isEditing ? 'Atualize os dados' : 'Cadastre um novo tipo de material'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/cadastros/tipos-material')}><ArrowLeft size={16} /> Voltar</button>
      </div>
      <div className="form-card">
        {apiError && <div className="alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-col-full">
              <FormField label="Nome" required error={errors.nome}>
                <input className={`input ${errors.nome ? 'input-error' : ''}`} type="text" placeholder="Ex: Areia média, Brita 1" {...register('nome')} />
              </FormField>
            </div>
            <div className="form-col-full">
              <FormField label="Descrição" error={errors.descricao}>
                <textarea className="input textarea" rows={3} placeholder="Descrição do tipo de material e suas aplicações" {...register('descricao')} />
              </FormField>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cadastros/tipos-material')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}><Save size={16} />{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
