import React from 'react';
import { PessoaForm } from './PessoaForm';
import { PessoasList } from './PessoasList';

export const PessoasPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handlePessoaCriada = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <PessoaForm onSuccess={handlePessoaCriada} />
      <PessoasList key={refreshKey} />
    </div>
  );
};
