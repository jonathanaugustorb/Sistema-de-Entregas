import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';
import { useToast } from '../../../components/ui/Toast';
import { motoristaService } from '../../../services/motoristaService';
import { ApiError } from '../../../types/api';

const HABILITACOES = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'] as const;

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  numeroCnh: z.string().regex(/^\d{11}$/, 'CNH deve ter exatamente 11 dígitos numéricos'),
  tipoHabilitacao: z.enum(['A','B','C','D','E','AB','AC','AD','AE'], { message: 'Selecione o tipo de habilitação' }),
  veiculoHabitual: z.string().max(100, 'Máximo 100 caracteres').optional(),
  contato: z.string().max(20, 'Máximo 20 caracteres').optional(),
});

type FormData = z.infer<typeof schema>;

export function MotoristaFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingData, setLoadingData] = useState(isEditing);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isEditing) return;
    motoristaService.buscarPorId(Number(id))
      .then((m) => reset({ nome: m.nome, numeroCnh: m.numeroCnh, tipoHabilitacao: m.tipoHabilitacao as any, veiculoHabitual: m.veiculoHabitual ?? '', contato: m.contato ?? '' }))
      .catch(() => showToast('Erro ao carregar dados.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing, reset, showToast]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const payload = { ...data, veiculoHabitual: data.veiculoHabitual || undefined, contato: data.contato || undefined };
      if (isEditing) {
        await motoristaService.atualizar(Number(id), payload);
        showToast('Motorista atualizado com sucesso!');
      } else {
        await motoristaService.criar(payload);
        showToast('Motorista cadastrado com sucesso!');
      }
      navigate('/cadastros/motoristas');
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Erro inesperado.');
    }
  };

  if (loadingData) return <div className="page"><p className="text-muted">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Motorista' : 'Novo Motorista'}</h1>
          <p className="page-subtitle">{isEditing ? 'Atualize os dados do motorista' : 'Cadastre um novo motorista'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/cadastros/motoristas')}><ArrowLeft size={16} /> Voltar</button>
      </div>
      <div className="form-card">
        {apiError && <div className="alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-col-full">
              <FormField label="Nome Completo" required error={errors.nome}>
                <input className={`input ${errors.nome ? 'input-error' : ''}`} type="text" placeholder="Nome do motorista" {...register('nome')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Número da CNH" required error={errors.numeroCnh} hint="Exatamente 11 dígitos numéricos">
                <input className={`input ${errors.numeroCnh ? 'input-error' : ''}`} type="text" placeholder="12345678901" maxLength={11} {...register('numeroCnh')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Tipo de Habilitação" required error={errors.tipoHabilitacao}>
                <select className={`input ${errors.tipoHabilitacao ? 'input-error' : ''}`} {...register('tipoHabilitacao')}>
                  <option value="">Selecione...</option>
                  {HABILITACOES.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Veículo Habitual" error={errors.veiculoHabitual}>
                <input className="input" type="text" placeholder="Ex: Caminhão Ford Cargo" {...register('veiculoHabitual')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Contato" error={errors.contato}>
                <input className="input" type="tel" placeholder="Ex: 11987654321" {...register('contato')} />
              </FormField>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cadastros/motoristas')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}><Save size={16} />{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
