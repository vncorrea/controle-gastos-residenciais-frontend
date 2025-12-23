export type TipoTransacao = 'Despesa' | 'Receita';
export type FinalidadeCategoria = 'Despesa' | 'Receita' | 'Ambas';

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface CreatePessoaDTO {
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CreateCategoriaDTO {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
  categoria?: Categoria;
  pessoa?: Pessoa;
}

export interface CreateTransacaoDTO {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
}

export interface TotaisPorPessoa {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisPorPessoaResponse {
  pessoas: TotaisPorPessoa[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoLiquidoGeral: number;
}

export interface TotaisPorCategoria {
  categoriaId: number;
  descricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisPorCategoriaResponse {
  categorias: TotaisPorCategoria[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoLiquidoGeral: number;
}
