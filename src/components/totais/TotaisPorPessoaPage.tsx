import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaUser } from 'react-icons/fa';
import { TotaisPorPessoaResponse } from '../../types';
import { totaisService } from '../../services/totaisService';
import { transacaoService } from '../../services/transacaoService';
import { Card } from '../shared/Card';
import { DashboardCard } from '../shared/DashboardCard';
import { ProgressBar } from '../shared/ProgressBar';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import './TotaisPorPessoaPage.css';

export const TotaisPorPessoaPage: React.FC = () => {
  const [dados, setDados] = useState<TotaisPorPessoaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numTransacoes, setNumTransacoes] = useState<Record<number, number>>({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dadosTotais, transacoes] = await Promise.all([
        totaisService.totaisPorPessoa(),
        transacaoService.listar(),
      ]);
      
      const contador: Record<number, number> = {};
      transacoes.forEach(t => {
        contador[t.pessoaId] = (contador[t.pessoaId] || 0) + 1;
      });
      setNumTransacoes(contador);
      setDados(dadosTotais);
    } catch (err) {
      setError('Erro ao carregar totais. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularPorcentagem = (valor: number, totalGeral: number): number => {
    if (totalGeral === 0) return 0;
    return (Math.abs(valor) / totalGeral) * 100;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={carregarDados}>Tentar novamente</button>
        </div>
      </Card>
    );
  }

  if (!dados) {
    return null;
  }

  const totalGeral = dados.totalDespesasGeral;
  const mediaPorPessoa = dados.pessoas.length > 0 
    ? totalGeral / dados.pessoas.length 
    : 0;

  return (
    <>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Geral"
          value={formatCurrency(totalGeral)}
          subtitle="Soma de todas as pessoas"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Pessoas Cadastradas"
          value={dados.pessoas.length}
          subtitle="Total de pessoas ativas"
          icon={<FaUsers />}
        />
        <DashboardCard
          title="Média por Pessoa"
          value={formatCurrency(mediaPorPessoa)}
          subtitle="Gasto médio individual"
          icon={<FaUser />}
        />
      </div>

      <Card 
        title="Gastos por Pessoa" 
        subtitle="Resumo dos gastos organizados por pessoa"
        icon={<FaUsers />}
      >
        {dados.pessoas.length === 0 ? (
          <p className="empty-message">Nenhum dado disponível.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>PESSOA</th>
                <th>TRANSAÇÕES</th>
                <th>TOTAL</th>
                <th>% DO TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {dados.pessoas.map((total) => {
                const valorTotal = total.totalDespesas;
                const porcentagem = calcularPorcentagem(valorTotal, totalGeral);
                return (
                  <tr key={total.pessoaId}>
                    <td><strong>{total.nome}</strong></td>
                    <td>{numTransacoes[total.pessoaId] || 0} transações</td>
                    <td className="tipo-despesa">
                      <strong>{formatCurrency(valorTotal)}</strong>
                    </td>
                    <td>
                      <ProgressBar percentage={porcentagem} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
};
