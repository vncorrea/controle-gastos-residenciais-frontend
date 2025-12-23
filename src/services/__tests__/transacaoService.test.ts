import apiClient from '@/services/api';
import { transacaoService } from '@/services/transacaoService';
import { Transacao, CreateTransacaoDTO } from '@/types';

jest.mock('@/services/api', () => {
  const get = jest.fn();
  const post = jest.fn();
  return { __esModule: true, default: { get, post } };
});

const mockedApi = apiClient as unknown as {
  get: jest.Mock;
  post: jest.Mock;
};

describe('transacaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listar busca /transacoes', async () => {
    const transacoes: Transacao[] = [
      { id: 1, descricao: 'Compra', valor: 100, tipo: 'Despesa', categoriaId: 1, pessoaId: 1 },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: transacoes });

    const result = await transacaoService.listar();

    expect(mockedApi.get).toHaveBeenCalledWith('/transacoes');
    expect(result).toEqual(transacoes);
  });

  it('criar envia payload e retorna transacao', async () => {
    const dto: CreateTransacaoDTO = {
      descricao: 'Venda',
      valor: 200,
      tipo: 'Receita',
      categoriaId: 2,
      pessoaId: 1,
    };
    const created: Transacao = { id: 2, ...dto };
    mockedApi.post.mockResolvedValueOnce({ data: created });

    const result = await transacaoService.criar(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/transacoes', dto);
    expect(result).toEqual(created);
  });
});

