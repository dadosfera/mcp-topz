# MCP Topz

Servidor MCP (Model Context Protocol) para interagir com a API OData da Topz.

Este servidor permite que assistentes de IA (como Claude no Cursor ou Claude Desktop) consultem dados da API Topz usando ferramentas estruturadas.

## 🚀 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Chave de API da Topz

### Instalação das dependências

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo de configuração:

```bash
cp env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:

```env
TOPZ_API_KEY=sua_chave_api_aqui
TOPZ_BASE_URL=https://sua-instancia-topz.com
```

### Build

```bash
npm run build
```

## 📖 Uso

### Executar o servidor

```bash
npm start
```

Ou em modo de desenvolvimento:

```bash
npm run dev
```

### Configuração no Cursor

Adicione a seguinte configuração no arquivo `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "topz": {
      "command": "node",
      "args": ["/caminho/para/mcp-topz/dist/index.js"],
      "env": {
        "TOPZ_API_KEY": "sua_chave_api_aqui",
        "TOPZ_BASE_URL": "https://sua-instancia-topz.com"
      }
    }
  }
}
```

### Configuração no Claude Desktop

Adicione a seguinte configuração no arquivo de configuração do Claude Desktop:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "topz": {
      "command": "node",
      "args": ["/caminho/para/mcp-topz/dist/index.js"],
      "env": {
        "TOPZ_API_KEY": "sua_chave_api_aqui",
        "TOPZ_BASE_URL": "https://sua-instancia-topz.com"
      }
    }
  }
}
```

## 🛠️ Ferramentas Disponíveis

### `get_schema`

Obtém o schema completo da API OData da Topz.

**Parâmetros**: Nenhum

**Exemplo de uso**:
> "Mostre-me o schema da API Topz"

---

### `query_orders`

Consulta pedidos (orders) usando sintaxe OData.

**Parâmetros**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `select` | string | Campos a retornar, separados por vírgula |
| `filter` | string | Filtro OData |
| `top` | number | Limite de resultados |
| `skip` | number | Resultados a pular (paginação) |
| `orderby` | string | Campo para ordenação |

**Exemplos de uso**:

> "Mostre todos os pedidos"

> "Busque pedidos com valor acima de $300.000"
> (filter: `total gt 300000`)

> "Encontre pedidos em progresso com valor maior que $10.000"
> (filter: `total gt 10000 and order_status eq 'Active Project - In-Progress'`)

> "Busque o pedido 'Gordon Square'"
> (filter: `search eq 'Gordon Square'`)

> "Liste os 10 maiores pedidos"
> (top: `10`, orderby: `total desc`)

---

### `query_payment_terms`

Consulta termos de pagamento usando sintaxe OData.

**Parâmetros**:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `select` | string | Campos a retornar, separados por vírgula |
| `filter` | string | Filtro OData |
| `top` | number | Limite de resultados |
| `skip` | number | Resultados a pular (paginação) |
| `orderby` | string | Campo para ordenação |

**Exemplos de uso**:

> "Mostre todos os termos de pagamento ativos"
> (filter: `active eq true`)

> "Liste os termos de pagamento ordenados por nome"
> (orderby: `name asc`)

## 📚 Referência OData

### Operadores de Filtro

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `eq` | Igual a | `status eq 'Active'` |
| `ne` | Diferente de | `status ne 'Closed'` |
| `gt` | Maior que | `total gt 10000` |
| `ge` | Maior ou igual | `total ge 10000` |
| `lt` | Menor que | `total lt 10000` |
| `le` | Menor ou igual | `total le 10000` |
| `and` | E lógico | `total gt 1000 and status eq 'Active'` |
| `or` | OU lógico | `status eq 'Active' or status eq 'Pending'` |

### Filtro de Busca

A API Topz suporta um filtro especial `search` para busca textual:

```
filter: search eq 'termo de busca'
```

## 🏗️ Estrutura do Projeto

```
mcp-topz/
├── src/
│   ├── index.ts              # Ponto de entrada
│   ├── server.ts             # Configuração do servidor MCP
│   ├── api/
│   │   ├── client.ts         # Cliente HTTP
│   │   └── types.ts          # Tipos TypeScript
│   ├── tools/
│   │   ├── index.ts          # Export das tools
│   │   ├── schema.ts         # Tool: get_schema
│   │   ├── orders.ts         # Tool: query_orders
│   │   └── payment-terms.ts  # Tool: query_payment_terms
│   └── utils/
│       └── odata-builder.ts  # Utilitário OData
├── dist/                     # Build compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Desenvolvimento

### Adicionar nova ferramenta

1. Crie um novo arquivo em `src/tools/`
2. Defina a tool definition com nome, descrição e schema
3. Implemente a função de execução
4. Exporte no `src/tools/index.ts`
5. Registre no `src/server.ts`

### Scripts disponíveis

```bash
npm run build    # Compila TypeScript
npm start        # Executa o servidor compilado
npm run dev      # Executa em modo desenvolvimento
```

## 📝 Licença

MIT


