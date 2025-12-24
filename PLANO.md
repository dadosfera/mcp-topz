# Plano de Implementação - MCP Server para Topz OData API

## 📋 Visão Geral

Este documento descreve o plano completo para criar um servidor MCP (Model Context Protocol) que permite interagir com a API OData da Topz através de ferramentas (tools) que podem ser utilizadas por assistentes de IA.

## 🎯 Objetivos

1. Criar um servidor MCP em TypeScript/Node.js
2. Implementar ferramentas para consultar a API OData da Topz
3. Suportar autenticação Bearer Token
4. Permitir consultas flexíveis usando sintaxe OData ($select, $filter, etc.)
5. Fornecer documentação completa e exemplos de uso

## 📁 Estrutura do Projeto

```
mcp-topz/
├── src/
│   ├── index.ts                 # Ponto de entrada do servidor MCP
│   ├── server.ts                # Configuração e inicialização do servidor
│   ├── api/
│   │   ├── client.ts            # Cliente HTTP para a API Topz
│   │   └── types.ts             # Tipos TypeScript para a API
│   ├── tools/
│   │   ├── schema.ts            # Tool: obter schema da API
│   │   ├── orders.ts            # Tool: consultar orders
│   │   └── payment-terms.ts     # Tool: consultar payment terms
│   └── utils/
│       ├── odata-builder.ts     # Utilitário para construir queries OData
│       └── errors.ts            # Tratamento de erros
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── PLANO.md (este arquivo)
```

## 🔧 Configurações e Dependências

### Dependências Principais

- `@modelcontextprotocol/sdk` - SDK oficial do MCP
- `node-fetch` ou `axios` - Cliente HTTP
- `dotenv` - Gerenciamento de variáveis de ambiente
- `zod` - Validação de schemas (opcional, mas recomendado)

### Dependências de Desenvolvimento

- `typescript` - Compilador TypeScript
- `@types/node` - Tipos para Node.js
- `tsx` ou `ts-node` - Executar TypeScript diretamente
- `eslint` - Linter (opcional)
- `prettier` - Formatação (opcional)

### Variáveis de Ambiente

```env
TOPZ_API_KEY=your_api_key_here
TOPZ_BASE_URL=https://api.topz.com  # ou URL base da API
```

## 🛠️ Implementação das Ferramentas (Tools)

### 1. Tool: `get_schema`
**Descrição**: Obtém o schema completo da API OData

**Parâmetros**: Nenhum

**Retorno**: Schema JSON da API

**Endpoint**: `GET /api/v1.0/schema`

### 2. Tool: `query_orders`
**Descrição**: Consulta orders (pedidos) usando sintaxe OData

**Parâmetros**:
- `select` (opcional): Campos a retornar (ex: "id,name,customer,total")
- `filter` (opcional): Filtro OData (ex: "total gt 300000")
- `top` (opcional): Limite de resultados
- `skip` (opcional): Número de resultados para pular
- `orderby` (opcional): Campo para ordenação

**Retorno**: Lista de orders conforme os filtros aplicados

**Endpoint**: `GET /api/v1.0/odata/order`

**Exemplos de uso**:
- Buscar todos os orders
- Buscar orders com total > $300,000
- Buscar orders em progresso com total > $10K
- Buscar orders por nome (search)
- Buscar orders criados por alguém específico

### 3. Tool: `query_payment_terms`
**Descrição**: Consulta payment terms (termos de pagamento) usando sintaxe OData

**Parâmetros**:
- `select` (opcional): Campos a retornar (ex: "id,name,active")
- `filter` (opcional): Filtro OData (ex: "active eq true")
- `top` (opcional): Limite de resultados
- `skip` (opcional): Número de resultados para pular
- `orderby` (opcional): Campo para ordenação

**Retorno**: Lista de payment terms conforme os filtros aplicados

**Endpoint**: `GET /api/v1.0/odata/payment_term`

## 📝 Detalhamento da Implementação

### 1. Cliente HTTP (`src/api/client.ts`)

- Classe `TopzApiClient` que encapsula todas as chamadas HTTP
- Métodos para cada endpoint
- Tratamento de erros HTTP
- Headers padrão (Content-Type, Accept, Authorization)
- Suporte a query parameters OData

### 2. Builder OData (`src/utils/odata-builder.ts`)

- Função utilitária para construir URLs com query parameters OData
- Suporte para:
  - `$select`
  - `$filter`
  - `$top`
  - `$skip`
  - `$orderby`
  - `$count` (se suportado)

### 3. Servidor MCP (`src/server.ts`)

- Inicialização do servidor MCP usando o SDK
- Registro de todas as tools
- Tratamento de erros global
- Logging básico

### 4. Tools (`src/tools/*.ts`)

Cada tool deve:
- Validar parâmetros de entrada
- Construir a query OData apropriada
- Fazer a chamada à API através do cliente
- Tratar erros e retornar mensagens amigáveis
- Retornar dados formatados

## 🔐 Autenticação

- Todas as requisições usam Bearer Token
- Token obtido da variável de ambiente `TOPZ_API_KEY`
- Header: `Authorization: Bearer {token}`

## 📚 Documentação

### README.md deve incluir:

1. **Descrição do projeto**
2. **Instalação**
   - Pré-requisitos (Node.js, npm/yarn)
   - Instalação de dependências
   - Configuração de variáveis de ambiente

3. **Uso**
   - Como executar o servidor MCP
   - Como configurar no Cursor/Claude Desktop
   - Exemplos de uso de cada tool

4. **API Reference**
   - Documentação de cada tool
   - Parâmetros aceitos
   - Exemplos de queries OData

5. **Desenvolvimento**
   - Como adicionar novas tools
   - Estrutura do código
   - Como testar

## 🧪 Testes (Futuro)

- Testes unitários para o cliente HTTP
- Testes para o builder OData
- Testes de integração para as tools
- Mock da API para testes

## 🚀 Próximos Passos

1. ✅ Criar estrutura de pastas
2. ✅ Configurar package.json com dependências
3. ✅ Configurar TypeScript (tsconfig.json)
4. ✅ Criar .env.example e .gitignore
5. ✅ Implementar cliente HTTP básico
6. ✅ Implementar builder OData
7. ✅ Implementar tool get_schema
8. ✅ Implementar tool query_orders
9. ✅ Implementar tool query_payment_terms
10. ✅ Configurar servidor MCP
11. ✅ Criar README.md completo
12. ✅ Testar integração com Cursor/Claude Desktop

## 📌 Notas Importantes

- A API usa OData v4, então devemos seguir a especificação OData
- Todos os endpoints retornam JSON
- A API pode ter rate limiting - considerar implementar retry logic
- Alguns campos podem ser opcionais nas respostas
- O filtro `search` parece ser um campo especial para busca textual

## 🔄 Melhorias Futuras (Opcional)

- Suporte a paginação automática
- Cache de schema
- Suporte a outros endpoints OData (se houver)
- Validação mais robusta de queries OData
- Suporte a operações de escrita (POST, PATCH, DELETE) se a API permitir
- Métricas e logging avançado

