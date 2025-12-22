import React, { useState, useEffect } from 'react';
import { FaListAlt } from 'react-icons/fa';
import { Categoria } from '../../types';
import { categoriaService } from '../../services/categoriaService';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import './CategoriasList.css';

export const CategoriasList: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (err) {
      setError('Erro ao carregar categorias. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFinalidade = (finalidade: string): string => {
    const map: Record<string, string> = {
      Despesa: 'Despesa',
      Receita: 'Receita',
      Ambas: 'Despesa/Receita',
    };
    return map[finalidade] || finalidade;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Lista de Categorias" 
      subtitle="Categorias cadastradas no sistema"
      icon={<FaListAlt />}
    >
      {categorias.length === 0 ? (
        <p className="empty-message">Nenhuma categoria cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>FINALIDADE</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.descricao}</td>
                <td>{formatFinalidade(categoria.finalidade)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
