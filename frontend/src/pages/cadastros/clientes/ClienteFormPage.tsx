import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { FormField } from '../../../components/ui/FormField';
import { useToast } from '../../../components/ui/Toast';
import { clienteService } from '../../../services/clienteService';
import { ApiError } from '../../../types/api';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255, 'Nome muito longo'),
  enderecoCompleto: z
    .string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  pontoReferencia: z.string().optional(),
  telefone: z
    .string()
    .optional()
    .refine((v) => !v || (v.length >= 8 && v.length <= 20), {
      message: 'Telefone deve ter entre 8 e 20 caracteres',
    }),
});

type FormData = z.infer<typeof schema>;

export function ClienteFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isEditing) return;
    clienteService
      .buscarPorId(Number(id))
      .then((c) => {
        reset({
          nome: c.nome,
          enderecoCompleto: c.enderecoCompleto,
          pontoReferencia: c.pontoReferencia ?? '',
          telefone: c.telefone ?? '',
        });
      })
      .catch(() => showToast('Erro ao carregar dados do cliente.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id, isEditing, reset, showToast]);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    setLoading(true);
    try {
      const payload = {
        nome: data.nome,
        enderecoCompleto: data.enderecoCompleto,
        pontoReferencia: data.pontoReferencia || undefined,
        telefone: data.telefone || undefined,
      };

      if (isEditing) {
        await clienteService.atualizar(Number(id), payload);
        showToast('Cliente atualizado com sucesso!');
      } else {
        await clienteService.criar(payload);
        showToast('Cliente cadastrado com sucesso!');
      }
      navigate('/cadastros/clientes');
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="page">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="page-subtitle">
            {isEditing ? 'Atualize os dados do cliente' : 'Preencha os dados para cadastrar um novo cliente'}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/cadastros/clientes')}>
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <div className="form-card">
        {apiError && (
          <div className="alert-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-col-full">
              <FormField label="Nome" required error={errors.nome}>
                <input
                  className={`input ${errors.nome ? 'input-error' : ''}`}
                  type="text"
                  placeholder="Nome do cliente"
                  {...register('nome')}
                />
              </FormField>
            </div>

            <div className="form-col-full">
              <FormField label="Endereço Completo" required error={errors.enderecoCompleto}>
                <input
                  className={`input ${errors.enderecoCompleto ? 'input-error' : ''}`}
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  {...register('enderecoCompleto')}
                />
              </FormField>
            </div>

            <div className="form-col-half">
              <FormField label="Ponto de Referência" error={errors.pontoReferencia}>
                <input
                  className="input"
                  type="text"
                  placeholder="Ex: Próximo ao mercado"
                  {...register('pontoReferencia')}
                />
              </FormField>
            </div>

            <div className="form-col-half">
              <FormField
                label="Telefone"
                error={errors.telefone}
                hint="Somente números, com DDD"
              >
                <input
                  className={`input ${errors.telefone ? 'input-error' : ''}`}
                  type="tel"
                  placeholder="Ex: 11987654321"
                  {...register('telefone')}
                />
              </FormField>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/cadastros/clientes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || loading}
            >
              <Save size={16} />
              {isSubmitting || loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
