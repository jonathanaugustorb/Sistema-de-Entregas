import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';
import { useToast } from '../../../components/ui/Toast';
import { veiculoService } from '../../../services/veiculoService';
import { ApiError } from '../../../types/api';

const schema = z.object({
  identificacao: z.string().min(1, 'Identificação é obrigatória').max(100, 'Máximo 100 caracteres'),
  capacidadeMaxima: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, { message: 'Capacidade deve ser maior que zero' }),
  tipoCarroceria: z.string().optional(),
  statusOperacional: z.enum(['ATIVO', 'INATIVO', 'MANUTENCAO'], { message: 'Selecione o status' }),
});

type FormData = z.infer<typeof schema>;

export function VeiculoFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingData, setLoadingData] = useState(isEditing);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statusOperacional: 'ATIVO' },
  });

  useEffect(() => {
    if (!isEditing) return;
    veiculoService.buscarPorId(Number(id))
      .then((v) => reset({ identificacao: v.identificacao, capacidadeMaxima: String(v.capacidadeMaxima), tipoCarroceria: v.tipoCarroceria ?? '', statusOperacional: v.statusOperacional }))
      .catch(() => showToast('Erro ao carregar dados.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing, reset, showToast]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const payload = { ...data, capacidadeMaxima: parseFloat(data.capacidadeMaxima), tipoCarroceria: data.tipoCarroceria || undefined };
      if (isEditing) {
        await veiculoService.atualizar(Number(id), payload);
        showToast('Veículo atualizado com sucesso!');
      } else {
        await veiculoService.criar(payload);
        showToast('Veículo cadastrado com sucesso!');
      }
      navigate('/cadastros/veiculos');
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Erro inesperado.');
    }
  };

  if (loadingData) return <div className="page"><p className="text-muted">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Veículo' : 'Novo Veículo'}</h1>
          <p className="page-subtitle">{isEditing ? 'Atualize os dados do veículo' : 'Cadastre um novo veículo da frota'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/cadastros/veiculos')}><ArrowLeft size={16} /> Voltar</button>
      </div>
      <div className="form-card">
        {apiError && <div className="alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-col-half">
              <FormField label="Identificação (Placa/Frota)" required error={errors.identificacao}>
                <input className={`input ${errors.identificacao ? 'input-error' : ''}`} type="text" placeholder="Ex: ABC-1234 ou F001" {...register('identificacao')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Status Operacional" required error={errors.statusOperacional}>
                <select className={`input ${errors.statusOperacional ? 'input-error' : ''}`} {...register('statusOperacional')}>
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="MANUTENCAO">Em Manutenção</option>
                </select>
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Capacidade Máxima (toneladas)" required error={errors.capacidadeMaxima}>
                <input className={`input ${errors.capacidadeMaxima ? 'input-error' : ''}`} type="number" step="0.01" min="0.01" placeholder="Ex: 15.00" {...register('capacidadeMaxima')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Tipo de Carroceria" error={errors.tipoCarroceria}>
                <input className="input" type="text" placeholder="Ex: Caçamba, Graneleiro, Plataforma" {...register('tipoCarroceria')} />
              </FormField>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cadastros/veiculos')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}><Save size={16} />{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
