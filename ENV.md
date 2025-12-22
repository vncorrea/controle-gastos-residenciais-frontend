# Configuração de Variáveis de Ambiente

## Configuração da API

Para configurar a URL base da API do backend, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Importante:** 
- A variável deve começar com `VITE_` para ser acessível no código frontend
- Se não configurar, o padrão é `http://localhost:5000/api`
- Após criar/modificar o arquivo `.env`, é necessário reiniciar o servidor de desenvolvimento

## Exemplo de uso

Se seu backend estiver rodando em uma porta diferente ou em outro servidor:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

ou

```
VITE_API_BASE_URL=https://api.meusite.com/api
```

