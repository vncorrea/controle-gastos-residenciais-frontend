import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout/index';
import { PessoasPage } from '@/components/pessoas/PessoasPage';
import { CategoriasPage } from '@/components/categorias/CategoriasPage';
import { TransacoesPage } from '@/components/transacoes/TransacoesPage';
import { TotaisPorPessoaPage } from '@/components/totais/TotaisPorPessoaPage/index';
import { TotaisPorCategoriaPage } from '@/components/totais/TotaisPorCategoriaPage/index';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/pessoas" replace />} />
          <Route path="/pessoas" element={<PessoasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
          <Route path="/totais/pessoas" element={<TotaisPorPessoaPage />} />
          <Route path="/totais/categorias" element={<TotaisPorCategoriaPage />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
