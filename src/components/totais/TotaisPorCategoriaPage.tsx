import React, { useState, useEffect } from 'react';
import { FaTags, FaChartLine, FaClock } from 'react-icons/fa';
import { TotaisPorCategoriaResponse } from '../../types';
import { totaisService } from '../../services/totaisService';
import { transacaoService } from '../../services/transacaoService';
import { Card } from '../shared/Card';
import { DashboardCard } from '../shared/DashboardCard';
import { ProgressBar } from '../shared/ProgressBar';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
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

  const calcularPorcentagem = (valor: number, totalGeral: number): number => {
    if (totalGeral === 0) return 0;
    return (Math.abs(valor) / totalGeral) * 100;
  };

  const getCategoriaColor = (index: number): string => {
    return categoriaColors[index % categoriaColors.length];
  };

  const getMaiorCategoria = (): string => {
    if (!dados || dados.categorias.length === 0) return '';
    const maior = dados.categorias.reduce((prev, current) => 
      (current.totalDespesas > prev.totalDespesas) ? current : prev
    );
    return maior.descricao;
  };

  const getMaiorCategoriaValor = (): number => {
    if (!dados || dados.categorias.length === 0) return 0;
    const maior = dados.categorias.reduce((prev, current) => 
      (current.totalDespesas > prev.totalDespesas) ? current : prev
    );
    return maior.totalDespesas;
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

  return (
    <>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total em Despesas"
          value={formatCurrency(totalGeralDespesas)}
          subtitle="Todas as categorias"
          icon={<FaChartLine />}
        />
        <DashboardCard
          title="Categorias"
          value={dados.categorias.length}
          subtitle="Categorias ativas"
          icon={<FaTags />}
        />
        <DashboardCard
          title="Maior Categoria"
          value={getMaiorCategoria()}
          subtitle={formatCurrency(getMaiorCategoriaValor())}
          icon={<FaClock />}
        />
      </div>

      <Card 
        title="Gastos por Categoria" 
        subtitle="Resumo dos gastos organizados por categoria"
        icon={<FaTags />}
      >
        {dados.categorias.length === 0 ? (
          <p className="empty-message">Nenhum dado disponível.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>CATEGORIA</th>
                <th>TRANSAÇÕES</th>
                <th>TOTAL</th>
                <th>% DO TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {dados.categorias.map((total, index) => {
                const porcentagem = calcularPorcentagem(total.totalDespesas, totalGeralDespesas);
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
                    <td className="tipo-despesa">
                      <strong>{formatCurrency(total.totalDespesas)}</strong>
                    </td>
                    <td>
                      <ProgressBar percentage={porcentagem} color={categoriaColor} />
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
