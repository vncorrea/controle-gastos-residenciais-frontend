import apiClient from '@/services/api';
import { totaisService } from '@/services/totaisService';
import { TotaisPorPessoaResponse, TotaisPorCategoriaResponse } from '@/types';

jest.mock('@/services/api', () => {
  const get = jest.fn();
  return { __esModule: true, default: { get } };
});

const mockedApi = apiClient as unknown as {
  get: jest.Mock;
};

describe('totaisService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('totaisPorPessoa chama endpoint correto e retorna dados', async () => {
    const mockData: TotaisPorPessoaResponse = {
      pessoas: [{ pessoaId: 1, nome: 'João', totalReceitas: 1000, totalDespesas: 500, saldo: 500 }],
      totalReceitasGeral: 1000,
      totalDespesasGeral: 500,
      saldoLiquidoGeral: 500,
    };
    mockedApi.get.mockResolvedValueOnce({ data: mockData });

    const result = await totaisService.totaisPorPessoa();

    expect(mockedApi.get).toHaveBeenCalledWith('/consultas/totais-por-pessoa');
    expect(result).toEqual(mockData);
  });

  it('totaisPorCategoria chama endpoint correto e retorna dados', async () => {
    const mockData: TotaisPorCategoriaResponse = {
      categorias: [{ categoriaId: 1, descricao: 'Salário', totalReceitas: 2000, totalDespesas: 0, saldo: 2000 }],
      totalReceitasGeral: 2000,
      totalDespesasGeral: 0,
      saldoLiquidoGeral: 2000,
    };
    mockedApi.get.mockResolvedValueOnce({ data: mockData });

    const result = await totaisService.totaisPorCategoria();

    expect(mockedApi.get).toHaveBeenCalledWith('/consultas/totais-por-categoria');
    expect(result).toEqual(mockData);
  });
});

