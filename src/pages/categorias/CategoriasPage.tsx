import React from 'react';
import { CategoriaForm } from '@/components/categorias/CategoriaForm';
import { CategoriasList } from '@/components/categorias/CategoriasList';

export const CategoriasPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleCategoriaCriada = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <CategoriaForm onSuccess={handleCategoriaCriada} />
      <CategoriasList key={refreshKey} />
    </div>
  );
};

