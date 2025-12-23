import React, { useState, useEffect } from 'react';
import { FaTags, FaChartLine } from 'react-icons/fa';
import { TotaisPorCategoriaResponse } from '@/types';
import { totaisService } from '@/services/totaisService';
import { transacaoService } from '@/services/transacaoService';
import { Card } from '@/components/shared/Card';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import './TotaisPorCategoriaPage.css';

const categoriaColors = [
  'var(--category-blue)',
  'var(--category-orange)',
  'var(--category-green)',
  'var(--category-purple)',
  'var(--category-pink)',
  'var(--category-cyan)',
];

export const TotaisPorCategoriaPage: React.FC = () => {
  const [dados, setDados] = useState<TotaisPorCategoriaResponse | null>(null);
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
        totaisService.totaisPorCategoria(),
        transacaoService.listar(),
      ]);
      
      const contador: Record<number, number> = {};
      transacoes.forEach(t => {
        contador[t.categoriaId] = (contador[t.categoriaId] || 0) + 1;
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

  const getCategoriaColor = (index: number): string => {
    return categoriaColors[index % categoriaColors.length];
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
          subtitle="Todas as categorias"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Total em Despesas"
          value={formatCurrency(totalGeralDespesas)}
          subtitle="Todas as categorias"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Saldo Líquido"
          value={formatCurrency(saldoLiquidoGeral)}
          subtitle="Receitas - Despesas"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Categorias"
          value={dados.categorias.length}
          subtitle="Categorias ativas"
          icon={<FaTags />}
        />
      </div>

      <Card 
        title="Totais por Categoria" 
        subtitle="Resumo de receitas e despesas organizados por categoria"
        icon={<FaTags />}
      >
        {dados.categorias.length === 0 ? (
          <p className="empty-message">Nenhum dado disponível.</p>
        ) : (
          <>
            <div className="table-container">
              <table className="totais-table">
                <thead>
                  <tr>
                    <th>CATEGORIA</th>
                    <th>TRANSAÇÕES</th>
                    <th>RECEITAS</th>
                    <th>DESPESAS</th>
                    <th>SALDO</th>
                    <th>% DO TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.categorias.map((total, index) => {
                    const totalGeral = totalGeralDespesas + totalGeralReceitas;
                    const porcentagem = totalGeral > 0 
                      ? (Math.abs(total.totalDespesas + total.totalReceitas) / totalGeral) * 100 
                      : 0;
                    const categoriaColor = getCategoriaColor(index);
                    return (
                      <tr key={total.categoriaId}>
                        <td>
                          <div className="categoria-item">
                            <span 
                              className="categoria-dot" 
                              style={{ backgroundColor: categoriaColor }}
                            />
                            <strong>{total.descricao}</strong>
                          </div>
                        </td>
                        <td>{numTransacoes[total.categoriaId] || 0} transações</td>
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
                          <ProgressBar percentage={porcentagem} color={categoriaColor} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mobile-cards">
              {dados.categorias.map((total, index) => {
                const totalGeral = totalGeralDespesas + totalGeralReceitas;
                const porcentagem = totalGeral > 0 
                  ? (Math.abs(total.totalDespesas + total.totalReceitas) / totalGeral) * 100 
                  : 0;
                const categoriaColor = getCategoriaColor(index);
                return (
                  <div key={total.categoriaId} className="categoria-card">
                    <div className="categoria-card-header">
                      <div className="categoria-item">
                        <span 
                          className="categoria-dot" 
                          style={{ backgroundColor: categoriaColor }}
                        />
                        <strong>{total.descricao}</strong>
                      </div>
                      <span className="categoria-transacoes">
                        {numTransacoes[total.categoriaId] || 0} transações
                      </span>
                    </div>
                    <div className="categoria-card-body">
                      <div className="categoria-value-row">
                        <div className="categoria-value">
                          <span className="categoria-label">Receitas</span>
                          <span className="tipo-receita">
                            {formatCurrency(total.totalReceitas)}
                          </span>
                        </div>
                        <div className="categoria-value">
                          <span className="categoria-label">Despesas</span>
                          <span className="tipo-despesa">
                            {formatCurrency(total.totalDespesas)}
                          </span>
                        </div>
                      </div>
                      <div className="categoria-value-row">
                        <div className="categoria-value">
                          <span className="categoria-label">Saldo</span>
                          <strong style={{ 
                            color: total.saldo >= 0 ? 'var(--success-color)' : 'var(--danger-color)' 
                          }}>
                            {formatCurrency(total.saldo)}
                          </strong>
                        </div>
                        <div className="categoria-value">
                          <span className="categoria-label">% do Total</span>
                          <span>{porcentagem.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="categoria-progress">
                        <ProgressBar percentage={porcentagem} color={categoriaColor} />
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

