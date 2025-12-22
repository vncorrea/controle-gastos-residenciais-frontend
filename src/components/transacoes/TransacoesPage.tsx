import React from 'react';
import { TransacaoForm } from './TransacaoForm';
import { TransacoesList } from './TransacoesList';

export const TransacoesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleTransacaoCriada = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <TransacaoForm onSuccess={handleTransacaoCriada} />
      <TransacoesList key={refreshKey} />
    </div>
  );
};
