import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';
import { useToast } from '../../../components/ui/Toast';
import { localidadeService } from '../../../services/localidadeService';
import { ApiError } from '../../../types/api';

const schema = z.object({
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  tipoVia: z.enum(['ASFALTADA', 'NAO_ASFALTADA'], { message: 'Selecione o tipo de via' }),
  aptidaoChuva: z.enum(['SIM', 'NAO', 'PARCIALMENTE'], { message: 'Selecione a aptidão para chuva' }),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LocalidadeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loadingData, setLoadingData] = useState(isEditing);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isEditing) return;
    localidadeService.buscarPorId(Number(id))
      .then((l) => reset({ endereco: l.endereco, tipoVia: l.tipoVia, aptidaoChuva: l.aptidaoChuva, observacoes: l.observacoes ?? '' }))
      .catch(() => showToast('Erro ao carregar dados.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing, reset, showToast]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const payload = { ...data, observacoes: data.observacoes || undefined };
      if (isEditing) {
        await localidadeService.atualizar(Number(id), payload);
        showToast('Localidade atualizada com sucesso!');
      } else {
        await localidadeService.criar(payload);
        showToast('Localidade cadastrada com sucesso!');
      }
      navigate('/cadastros/localidades');
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Erro inesperado.');
    }
  };

  if (loadingData) return <div className="page"><p className="text-muted">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Localidade' : 'Nova Localidade'}</h1>
          <p className="page-subtitle">{isEditing ? 'Atualize os dados da localidade' : 'Cadastre uma nova localidade de entrega'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/cadastros/localidades')}>
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <div className="form-card">
        {apiError && <div className="alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-col-full">
              <FormField label="Endereço" required error={errors.endereco}>
                <input className={`input ${errors.endereco ? 'input-error' : ''}`} type="text" placeholder="Ex: Estrada do Taboão, km 5, Mogi das Cruzes" {...register('endereco')} />
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Tipo de Via" required error={errors.tipoVia}>
                <select className={`input ${errors.tipoVia ? 'input-error' : ''}`} {...register('tipoVia')}>
                  <option value="">Selecione...</option>
                  <option value="ASFALTADA">Asfaltada</option>
                  <option value="NAO_ASFALTADA">Não Asfaltada</option>
                </select>
              </FormField>
            </div>
            <div className="form-col-half">
              <FormField label="Aptidão para Chuva" required error={errors.aptidaoChuva}>
                <select className={`input ${errors.aptidaoChuva ? 'input-error' : ''}`} {...register('aptidaoChuva')}>
                  <option value="">Selecione...</option>
                  <option value="SIM">Apto — acesso livre com chuva</option>
                  <option value="NAO">Restrito — não acessar com chuva</option>
                  <option value="PARCIALMENTE">Parcial — acesso com restrições</option>
                </select>
              </FormField>
            </div>
            <div className="form-col-full">
              <FormField label="Observações" error={errors.observacoes}>
                <textarea className="input textarea" rows={3} placeholder="Informações adicionais sobre acesso, restrições, etc." {...register('observacoes')} />
              </FormField>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cadastros/localidades')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />{isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
