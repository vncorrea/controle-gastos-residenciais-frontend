# Controle de Gastos Residenciais - Frontend

Sistema de controle de gastos residenciais desenvolvido em React com TypeScript. Este é o frontend do sistema, que se comunica com uma API backend desenvolvida em C#/.NET.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para comunicação com a API

## 📋 Funcionalidades

### Gerenciamento de Pessoas
- ✅ Cadastro de pessoas (nome, idade)
- ✅ Listagem de pessoas cadastradas
- ✅ Exclusão de pessoas (e suas transações relacionadas)

### Gerenciamento de Categorias
- ✅ Cadastro de categorias (descrição, finalidade: despesa/receita/ambas)
- ✅ Listagem de categorias cadastradas

### Gerenciamento de Transações
- ✅ Cadastro de transações (descrição, valor, tipo, categoria, pessoa)
- ✅ Listagem de transações cadastradas
- ✅ Validação: menores de 18 anos só podem ter despesas
- ✅ Validação: categoria deve ser compatível com o tipo de transação

### Consultas de Totais
- ✅ Totais por pessoa (receitas, despesas e saldo)
- ✅ Totais por categoria (receitas, despesas e saldo)
- ✅ Totais gerais consolidados

## 📦 Instalação

1. Clone o repositório ou navegue até a pasta do projeto

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure a URL da API:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione a variável `VITE_API_BASE_URL` com a URL do seu backend:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   - Se não configurar, o padrão é `http://localhost:5000/api`

## 🏃 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Build de Produção
```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`

### Preview do Build
```bash
npm run preview
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── categorias/     # Componentes relacionados a categorias
│   ├── layout/         # Componentes de layout (Navbar, Layout)
│   ├── pessoas/        # Componentes relacionados a pessoas
│   ├── shared/         # Componentes reutilizáveis (Button, Card, etc)
│   ├── totais/         # Componentes de consulta de totais
│   └── transacoes/     # Componentes relacionados a transações
├── config/             # Configurações da aplicação
│   └── api.ts          # Configuração da URL da API
├── services/           # Serviços de comunicação com a API
│   ├── api.ts          # Cliente HTTP base (axios)
│   ├── categoriaService.ts
│   ├── pessoaService.ts
│   ├── totaisService.ts
│   └── transacaoService.ts
├── styles/             # Estilos globais
│   └── global.css
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── utils/              # Funções utilitárias
│   └── formatters.ts   # Funções de formatação (moeda, etc)
├── App.tsx             # Componente principal com rotas
└── main.tsx            # Ponto de entrada da aplicação
```

## 🔌 Integração com Backend

O frontend espera que o backend C# esteja rodando e disponível na URL configurada. Os endpoints esperados são:

### Pessoas
- `GET /api/pessoas` - Listar todas as pessoas
- `POST /api/pessoas` - Criar pessoa
- `DELETE /api/pessoas/{id}` - Deletar pessoa

### Categorias
- `GET /api/categorias` - Listar todas as categorias
- `POST /api/categorias` - Criar categoria

### Transações
- `GET /api/transacoes` - Listar todas as transações
- `POST /api/transacoes` - Criar transação

### Totais
- `GET /api/totais/pessoas` - Totais por pessoa
- `GET /api/totais/categorias` - Totais por categoria

## 🎨 Características de Design

- Interface moderna e responsiva
- Design limpo e intuitivo
- Validação de formulários
- Feedback visual para ações do usuário
- Mensagens de erro claras
- Loading states durante requisições

## 📝 Boas Práticas Implementadas

- ✅ Separação de responsabilidades (components, services, types)
- ✅ Componentes reutilizáveis
- ✅ Tipagem forte com TypeScript
- ✅ Documentação inline no código
- ✅ Tratamento de erros
- ✅ Validação de formulários
- ✅ Estados de loading
- ✅ Código organizado e modular

## 🐛 Troubleshooting

### Erro de conexão com a API
- Verifique se o backend está rodando
- Confirme a URL da API no arquivo `.env` ou `src/config/api.ts`
- Verifique se há problemas de CORS no backend

### Dependências não instaladas
- Execute `npm install` novamente
- Delete a pasta `node_modules` e `package-lock.json` e execute `npm install`

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico.
