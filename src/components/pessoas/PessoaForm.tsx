import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { CreatePessoaDTO } from '../../types';
import { pessoaService } from '../../services/pessoaService';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FormField } from '../shared/FormField';
import './PessoaForm.css';

interface PessoaFormProps {
  onSuccess?: () => void;
}

export const PessoaForm: React.FC<PessoaFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreatePessoaDTO>({
    nome: '',
    idade: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePessoaDTO, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreatePessoaDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePessoaDTO, string>> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.idade || formData.idade <= 0) {
      newErrors.idade = 'Idade deve ser um número inteiro positivo';
    } else if (!Number.isInteger(formData.idade)) {
      newErrors.idade = 'Idade deve ser um número inteiro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await pessoaService.criar(formData);
      setFormData({ nome: '', idade: 0 });
      setErrors({});
      toast.success('Pessoa cadastrada com sucesso!');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao cadastrar pessoa. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      title="Cadastrar Pessoa" 
      subtitle="Adicione uma nova pessoa para controlar os gastos"
      icon={<FaUserPlus />}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <FormField label="Nome" error={errors.nome} required>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Digite o nome da pessoa"
            />
          </FormField>

          <FormField label="Idade" error={errors.idade} required>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.idade || ''}
              onChange={(e) => handleChange('idade', parseInt(e.target.value) || 0)}
              placeholder="Digite a idade"
            />
          </FormField>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar Pessoa'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
