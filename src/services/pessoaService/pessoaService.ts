import apiClient from '@/services/api';
import { Pessoa, CreatePessoaDTO } from '@/types';

export const pessoaService = {
  async listar(): Promise<Pessoa[]> {
    const response = await apiClient.get<Pessoa[]>('/pessoas');
    return response.data;
  },

  async criar(pessoa: CreatePessoaDTO): Promise<Pessoa> {
    const response = await apiClient.post<Pessoa>('/pessoas', pessoa);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await apiClient.delete(`/pessoas/${id}`);
  },
};
