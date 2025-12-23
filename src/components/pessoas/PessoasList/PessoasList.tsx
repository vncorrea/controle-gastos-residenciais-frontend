import React, { useState, useEffect } from 'react';
import { FaUsers, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { Pessoa } from '@/types';
import { pessoaService } from '@/services/pessoaService';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import './PessoasList.css';

export const PessoasList: React.FC = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pessoaService.listar();
      setPessoas(data);
    } catch (err) {
      setError('Erro ao carregar pessoas. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta pessoa? Todas as transações relacionadas também serão deletadas.')) {
      return;
    }

    try {
      setDeletingId(id);
      await pessoaService.deletar(id);
      await carregarPessoas();
      toast.success('Pessoa deletada com sucesso!');
    } catch (err) {
      toast.error('Erro ao deletar pessoa. Tente novamente.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card>
        <div className="error-message">
          <p>{error}</p>
          <Button onClick={carregarPessoas}>Tentar novamente</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Lista de Pessoas" 
      subtitle="Pessoas cadastradas no sistema"
      icon={<FaUsers />}
    >
      {pessoas.length === 0 ? (
        <p className="empty-message">Nenhuma pessoa cadastrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>IDADE</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.id}</td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.idade} anos</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletar(pessoa.id)}
                    disabled={deletingId === pessoa.id}
                    className="btn-icon"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
