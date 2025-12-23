import apiClient from '@/services/api';
import { pessoaService } from '@/services/pessoaService';
import { Pessoa, CreatePessoaDTO } from '@/types';

jest.mock('@/services/api', () => {
  const get = jest.fn();
  const post = jest.fn();
  const del = jest.fn();
  return { __esModule: true, default: { get, post, delete: del } };
});

const mockedApi = apiClient as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
};

describe('pessoaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listar retorna dados do endpoint /pessoas', async () => {
    const pessoas: Pessoa[] = [{ id: 1, nome: 'João', idade: 30 }];
    mockedApi.get.mockResolvedValueOnce({ data: pessoas });

    const result = await pessoaService.listar();

    expect(mockedApi.get).toHaveBeenCalledWith('/pessoas');
    expect(result).toEqual(pessoas);
  });

  it('criar envia payload e retorna pessoa criada', async () => {
    const dto: CreatePessoaDTO = { nome: 'Maria', idade: 25 };
    const created: Pessoa = { id: 2, ...dto };
    mockedApi.post.mockResolvedValueOnce({ data: created });

    const result = await pessoaService.criar(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/pessoas', dto);
    expect(result).toEqual(created);
  });

  it('deletar chama endpoint com id', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined);

    await pessoaService.deletar(3);

    expect(mockedApi.delete).toHaveBeenCalledWith('/pessoas/3');
  });
});

