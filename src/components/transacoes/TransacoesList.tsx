import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import { Transacao } from '../../types';
import { transacaoService } from '../../services/transacaoService';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import './TransacoesList.css';

export const TransacoesList: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transacaoService.listar();
      setTransacoes(data);
    } catch (err) {
      setError('Erro ao carregar transações. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTipoClass = (tipo: string): string => {
    return tipo === 'Receita' ? 'tipo-receita' : 'tipo-despesa';
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
      title="Lista de Transações" 
      subtitle="Histórico de todas as transações"
      icon={<FaHistory />}
    >
      {transacoes.length === 0 ? (
        <p className="empty-message">Nenhuma transação cadastrada.</p>
      ) : (
        <>
          <div className="table-container">
            <table className="transacoes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DESCRIÇÃO</th>
                  <th>VALOR</th>
                  <th>CATEGORIA</th>
                  <th>PESSOA</th>
                  <th>TIPO</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>{transacao.id}</td>
                    <td>{transacao.descricao}</td>
                    <td className={getTipoClass(transacao.tipo)}>
                      {formatCurrency(transacao.valor)}
                    </td>
                    <td>{transacao.categoria?.descricao || transacao.categoriaId}</td>
                    <td>{transacao.pessoa?.nome || transacao.pessoaId}</td>
                    <td>
                      <span className={`badge ${getTipoClass(transacao.tipo)}`}>
                        {transacao.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-cards">
            {transacoes.map((transacao) => (
              <div key={transacao.id} className="transacao-card">
                <div className="transacao-card-header">
                  <div className="transacao-id">#{transacao.id}</div>
                  <span className={`badge ${getTipoClass(transacao.tipo)}`}>
                    {transacao.tipo}
                  </span>
                </div>
                <div className="transacao-card-body">
                  <div className="transacao-descricao">
                    <strong>{transacao.descricao}</strong>
                  </div>
                  <div className="transacao-value-row">
                    <div className="transacao-value">
                      <span className="transacao-label">Valor</span>
                      <span className={getTipoClass(transacao.tipo)}>
                        <strong>{formatCurrency(transacao.valor)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="transacao-info-row">
                    <div className="transacao-info">
                      <span className="transacao-label">Categoria</span>
                      <span>{transacao.categoria?.descricao || transacao.categoriaId}</span>
                    </div>
                    <div className="transacao-info">
                      <span className="transacao-label">Pessoa</span>
                      <span>{transacao.pessoa?.nome || transacao.pessoaId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
