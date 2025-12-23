import apiClient from './api';
import { Categoria, CreateCategoriaDTO } from '@/types';

export const categoriaService = {
  async listar(): Promise<Categoria[]> {
    const response = await apiClient.get<Categoria[]>('/categorias');
    return response.data;
  },

  async criar(categoria: CreateCategoriaDTO): Promise<Categoria> {
    const response = await apiClient.post<Categoria>('/categorias', categoria);
    return response.data;
  },
};
