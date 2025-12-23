import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout/index';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Lazy load das páginas para code splitting
const PessoasPage = lazy(() => import('@/components/pessoas/PessoasPage').then(module => ({ default: module.PessoasPage })));
const CategoriasPage = lazy(() => import('@/components/categorias/CategoriasPage').then(module => ({ default: module.CategoriasPage })));
const TransacoesPage = lazy(() => import('@/components/transacoes/TransacoesPage').then(module => ({ default: module.TransacoesPage })));
const TotaisPorPessoaPage = lazy(() => import('@/pages/totais/TotaisPorPessoaPage/index').then(module => ({ default: module.TotaisPorPessoaPage })));
const TotaisPorCategoriaPage = lazy(() => import('@/pages/totais/TotaisPorCategoriaPage/index').then(module => ({ default: module.TotaisPorCategoriaPage })));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/pessoas" replace />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/transacoes" element={<TransacoesPage />} />
            <Route path="/totais/pessoas" element={<TotaisPorPessoaPage />} />
            <Route path="/totais/categorias" element={<TotaisPorCategoriaPage />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
