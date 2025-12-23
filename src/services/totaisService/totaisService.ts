import apiClient from '@/services/api';
import { TotaisPorPessoaResponse, TotaisPorCategoriaResponse } from '@/types';

export const totaisService = {
  async totaisPorPessoa(): Promise<TotaisPorPessoaResponse> {
    const response = await apiClient.get<TotaisPorPessoaResponse>('/consultas/totais-por-pessoa');
    return response.data;
  },

  async totaisPorCategoria(): Promise<TotaisPorCategoriaResponse> {
    const response = await apiClient.get<TotaisPorCategoriaResponse>('/consultas/totais-por-categoria');
    return response.data;
  },
};
