import React, { useState } from 'react';
import { FaTags } from 'react-icons/fa';
import { toast } from 'sonner';
import { CreateCategoriaDTO, FinalidadeCategoria } from '@/types';
import { categoriaService } from '@/services/categoriaService';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { FormField } from '@/components/shared/FormField';
import { Select } from '@/components/shared/Select';
import './CategoriaForm.css';

interface CategoriaFormProps {
  onSuccess?: () => void;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateCategoriaDTO>({
    descricao: '',
    finalidade: 'Ambas',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateCategoriaDTO, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreateCategoriaDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCategoriaDTO, string>> = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
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
      await categoriaService.criar(formData);
      setFormData({ descricao: '', finalidade: 'Ambas' });
      setErrors({});
      toast.success('Categoria cadastrada com sucesso!');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao cadastrar categoria. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      title="Cadastrar Categoria" 
      subtitle="Crie categorias para organizar suas despesas"
      icon={<FaTags />}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <FormField label="Nome" error={errors.descricao} required>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Digite o nome da categoria"
            />
          </FormField>

          <Select
            label="Finalidade"
            error={errors.finalidade}
            required
            value={formData.finalidade}
            onChange={(e) => handleChange('finalidade', e.target.value as FinalidadeCategoria)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas (Despesa/Receita)</option>
          </Select>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar Categoria'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
