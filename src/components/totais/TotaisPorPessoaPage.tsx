import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine } from 'react-icons/fa';
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

  const totalGeralDespesas = dados.totalDespesasGeral;
  const totalGeralReceitas = dados.totalReceitasGeral;
  const saldoLiquidoGeral = dados.saldoLiquidoGeral;

  return (
    <>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total em Receitas"
          value={formatCurrency(totalGeralReceitas)}
          subtitle="Todas as pessoas"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Total em Despesas"
          value={formatCurrency(totalGeralDespesas)}
          subtitle="Todas as pessoas"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Saldo Líquido"
          value={formatCurrency(saldoLiquidoGeral)}
          subtitle="Receitas - Despesas"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Pessoas Cadastradas"
          value={dados.pessoas.length}
          subtitle="Total de pessoas ativas"
          icon={<FaUsers />}
        />
      </div>

      <Card 
        title="Totais por Pessoa" 
        subtitle="Resumo de receitas e despesas organizados por pessoa"
        icon={<FaUsers />}
      >
        {dados.pessoas.length === 0 ? (
          <p className="empty-message">Nenhum dado disponível.</p>
        ) : (
          <>
            <div className="table-container">
              <table className="pessoas-table">
                <thead>
                  <tr>
                    <th>PESSOA</th>
                    <th>TRANSAÇÕES</th>
                    <th>RECEITAS</th>
                    <th>DESPESAS</th>
                    <th>SALDO</th>
                    <th>% DO TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.pessoas.map((total) => {
                    const totalGeral = totalGeralDespesas + totalGeralReceitas;
                    const porcentagem = totalGeral > 0 
                      ? (Math.abs(total.totalDespesas + total.totalReceitas) / totalGeral) * 100 
                      : 0;
                    return (
                      <tr key={total.pessoaId}>
                        <td><strong>{total.nome}</strong></td>
                        <td>{numTransacoes[total.pessoaId] || 0} transações</td>
                        <td className="tipo-receita">
                          <strong>{formatCurrency(total.totalReceitas)}</strong>
                        </td>
                        <td className="tipo-despesa">
                          <strong>{formatCurrency(total.totalDespesas)}</strong>
                        </td>
                        <td>
                          <strong style={{ 
                            color: total.saldo >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                          }}>
                            {formatCurrency(total.saldo)}
                          </strong>
                        </td>
                        <td>
                          <ProgressBar percentage={porcentagem} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mobile-cards">
              {dados.pessoas.map((total) => {
                const totalGeral = totalGeralDespesas + totalGeralReceitas;
                const porcentagem = totalGeral > 0 
                  ? (Math.abs(total.totalDespesas + total.totalReceitas) / totalGeral) * 100 
                  : 0;
                return (
                  <div key={total.pessoaId} className="pessoa-card">
                    <div className="pessoa-card-header">
                      <strong>{total.nome}</strong>
                      <span className="pessoa-transacoes">
                        {numTransacoes[total.pessoaId] || 0} transações
                      </span>
                    </div>
                    <div className="pessoa-card-body">
                      <div className="pessoa-value-row">
                        <div className="pessoa-value">
                          <span className="pessoa-label">Receitas</span>
                          <span className="tipo-receita">
                            {formatCurrency(total.totalReceitas)}
                          </span>
                        </div>
                        <div className="pessoa-value">
                          <span className="pessoa-label">Despesas</span>
                          <span className="tipo-despesa">
                            {formatCurrency(total.totalDespesas)}
                          </span>
                        </div>
                      </div>
                      <div className="pessoa-value-row">
                        <div className="pessoa-value">
                          <span className="pessoa-label">Saldo</span>
                          <strong style={{ 
                            color: total.saldo >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                          }}>
                            {formatCurrency(total.saldo)}
                          </strong>
                        </div>
                        <div className="pessoa-value">
                          <span className="pessoa-label">% do Total</span>
                          <span>{porcentagem.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="pessoa-progress">
                        <ProgressBar percentage={porcentagem} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </>
  );
};
