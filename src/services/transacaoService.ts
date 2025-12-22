import apiClient from './api';
import { Transacao, CreateTransacaoDTO } from '../types';

export const transacaoService = {
  async listar(): Promise<Transacao[]> {
    const response = await apiClient.get<Transacao[]>('/transacoes');
    return response.data;
  },

  async criar(transacao: CreateTransacaoDTO): Promise<Transacao> {
    const response = await apiClient.post<Transacao>('/transacoes', transacao);
    return response.data;
  },
};
