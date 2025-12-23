import apiClient from '@/services/api';
import { categoriaService } from '@/services/categoriaService';
import { Categoria, CreateCategoriaDTO } from '@/types';

jest.mock('@/services/api', () => {
  const get = jest.fn();
  const post = jest.fn();
  return { __esModule: true, default: { get, post } };
});

const mockedApi = apiClient as unknown as {
  get: jest.Mock;
  post: jest.Mock;
};

describe('categoriaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listar consulta /categorias', async () => {
    const categorias: Categoria[] = [{ id: 1, descricao: 'Alimentação', finalidade: 'Despesa' }];
    mockedApi.get.mockResolvedValueOnce({ data: categorias });

    const result = await categoriaService.listar();

    expect(mockedApi.get).toHaveBeenCalledWith('/categorias');
    expect(result).toEqual(categorias);
  });

  it('criar envia payload e retorna categoria', async () => {
    const dto: CreateCategoriaDTO = { descricao: 'Salário', finalidade: 'Receita' };
    const created: Categoria = { id: 2, ...dto };
    mockedApi.post.mockResolvedValueOnce({ data: created });

    const result = await categoriaService.criar(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/categorias', dto);
    expect(result).toEqual(created);
  });
});

