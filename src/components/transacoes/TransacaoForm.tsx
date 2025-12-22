import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import { CreateTransacaoDTO, TipoTransacao, Pessoa, Categoria } from '../../types';
import { transacaoService } from '../../services/transacaoService';
import { pessoaService } from '../../services/pessoaService';
import { categoriaService } from '../../services/categoriaService';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FormField } from '../shared/FormField';
import { Select } from '../shared/Select';
import './TransacaoForm.css';

interface TransacaoFormProps {
  onSuccess?: () => void;
}

export const TransacaoForm: React.FC<TransacaoFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateTransacaoDTO>({
    descricao: '',
    valor: 0,
    tipo: 'Despesa',
    categoriaId: 0,
    pessoaId: 0,
  });
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTransacaoDTO, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pessoasData, categoriasData] = await Promise.all([
        pessoaService.listar(),
        categoriaService.listar(),
      ]);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch (err) {
      alert('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateTransacaoDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Filtra categorias compatíveis com o tipo selecionado
  const getCategoriasFiltradas = (tipo: TipoTransacao): Categoria[] => {
    return categorias.filter((cat) => {
      if (cat.finalidade === 'Ambas') return true;
      return cat.finalidade === tipo;
    });
  };

  const isMenorDeIdade = (pessoaId: number): boolean => {
    const pessoa = pessoas.find((p) => p.id === pessoaId);
    return pessoa ? pessoa.idade < 18 : false;
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTransacaoDTO, string>> = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    if (!formData.categoriaId || formData.categoriaId === 0) {
      newErrors.categoriaId = 'Categoria é obrigatória';
    }

    if (!formData.pessoaId || formData.pessoaId === 0) {
      newErrors.pessoaId = 'Pessoa é obrigatória';
    }

    // Regra de negócio: menor de idade só pode ter despesas
    if (formData.pessoaId && isMenorDeIdade(formData.pessoaId) && formData.tipo === 'Receita') {
      newErrors.tipo = 'Menores de 18 anos só podem ter despesas';
    }

    // Categoria deve ser compatível com o tipo
    if (formData.categoriaId && formData.tipo) {
      const categoria = categorias.find((c) => c.id === formData.categoriaId);
      if (categoria && categoria.finalidade !== 'Ambas' && categoria.finalidade !== formData.tipo) {
        newErrors.categoriaId = `Esta categoria só permite ${categoria.finalidade === 'Despesa' ? 'despesas' : 'receitas'}`;
      }
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
      await transacaoService.criar(formData);
      setFormData({
        descricao: '',
        valor: 0,
        tipo: 'Despesa',
        categoriaId: 0,
        pessoaId: 0,
      });
      setErrors({});
      alert('Transação cadastrada com sucesso!');
      onSuccess?.();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar transação. Tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const categoriasFiltradas = getCategoriasFiltradas(formData.tipo);
  const pessoaSelecionada = pessoas.find((p) => p.id === formData.pessoaId);
  const isMenor = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  if (loading) {
    return <Card title="Cadastrar Transação"><p>Carregando...</p></Card>;
  }

  return (
    <Card 
      title="Registrar Transação" 
      subtitle="Adicione uma nova despesa ao sistema"
      icon={<FaDollarSign />}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <FormField label="Descrição" error={errors.descricao} required>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Digite a descrição"
            />
          </FormField>

          <FormField label="Valor" error={errors.valor} required>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={formData.valor || ''}
              onChange={(e) => handleChange('valor', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </FormField>
        </div>

        <div className="form-row">
          <Select
            label="Categoria"
            error={errors.categoriaId}
            required
            value={formData.categoriaId || ''}
            onChange={(e) => handleChange('categoriaId', parseInt(e.target.value) || 0)}
          >
            <option value="">Selecione uma categoria</option>
            {categoriasFiltradas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.descricao}
              </option>
            ))}
          </Select>

          <div>
            <Select
              label="Pessoa"
              error={errors.pessoaId}
              required
              value={formData.pessoaId || ''}
              onChange={(e) => handleChange('pessoaId', parseInt(e.target.value) || 0)}
            >
              <option value="">Selecione uma pessoa</option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </Select>
            {isMenor && (
              <p className="info-message">
                <FaExclamationTriangle /> Esta pessoa é menor de idade. Apenas despesas são permitidas.
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <Select
            label="Tipo"
            error={errors.tipo}
            required
            value={formData.tipo}
            onChange={(e) => {
              handleChange('tipo', e.target.value as TipoTransacao);
              // Limpa categoria se não for compatível
              if (formData.categoriaId) {
                const categoria = categorias.find((c) => c.id === formData.categoriaId);
                if (categoria && categoria.finalidade !== 'Ambas' && categoria.finalidade !== e.target.value) {
                  handleChange('categoriaId', 0);
                }
              }
            }}
            disabled={isMenor}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </Select>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar Transação'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
