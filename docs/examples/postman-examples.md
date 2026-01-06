# Exemplos de Consultas OData - API Topz

Este documento contém exemplos reais de consultas extraídos da coleção do Postman da API Topz OData.

## Orders (Pedidos)

### Exemplo 1: Listar todos os pedidos com campos específicos

**Nome do exemplo**: "Show me all orders"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,total`

**Descrição**: Retorna todos os pedidos com apenas os campos especificados. Útil para reduzir o tamanho da resposta quando não são necessários todos os campos.

---

### Exemplo 2: Pedidos acima de $300.000

**Nome do exemplo**: "Show me all orders over $300,000"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 300000
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `total gt 300000`

**Descrição**: Filtra pedidos com valor total maior que $300.000 usando o operador `gt` (greater than).

---

### Exemplo 3: Pedidos acima de $10K em progresso

**Nome do exemplo**: "Show me all orders over $10K in progress"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 10000 and order_status eq 'Active Project - In-Progress'
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `total gt 10000 and order_status eq 'Active Project - In-Progress'`

**Descrição**: Combina duas condições usando o operador `and`. Filtra pedidos com valor maior que $10.000 E status igual a 'Active Project - In-Progress'.

**Observações importantes**:
- O valor de `order_status` deve ser exatamente como aparece na API (case-sensitive)
- Strings em filtros OData devem estar entre aspas simples

---

### Exemplo 4: Buscar pedido por texto

**Nome do exemplo**: "Find the 'Gordon Square' order"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=search eq 'Gordon Square'
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `search eq 'Gordon Square'`

**Descrição**: Usa o filtro especial `search` para busca textual. Este é um filtro especial da API Topz que permite buscar por texto em múltiplos campos.

**Observações importantes**:
- O campo `search` é um filtro especial da API Topz, não um campo real da entidade
- Permite busca textual em múltiplos campos do pedido
- Útil para encontrar pedidos por nome, cliente, ou outros campos textuais

---

### Exemplo 5: Pedidos com valores altos (combinação AND/OR)

**Nome do exemplo**: "Show me orders with high amounts (and/or)"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=(total gt 20000 and cost gt 20000) or sales_tax gt 3000
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,cost,sales_tax,total`
- `$filter`: `(total gt 20000 and cost gt 20000) or sales_tax gt 3000`

**Descrição**: Demonstra uso de parênteses para agrupar condições e combinar operadores `and` e `or`. Retorna pedidos onde:
- (total > $20.000 E cost > $20.000) OU
- sales_tax > $3.000

**Campos adicionais identificados**:
- `cost`: Custo do pedido
- `sales_tax`: Imposto sobre vendas

**Observações importantes**:
- Parênteses são necessários para controlar a precedência dos operadores lógicos
- Permite criar filtros complexos combinando múltiplas condições

---

### Exemplo 6: Pedidos criados por alguém

**Nome do exemplo**: "Show me all orders created by someone"

**Query completa**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=creator eq 'Support, Sean'
```

**Parâmetros**:
- `$select`: `id,name,customer,order_status,cost,sales_tax,total`
- `$filter`: `creator eq 'Support, Sean'`

**Descrição**: Filtra pedidos pelo criador usando o campo `creator`.

**Observações importantes**:
- O campo `creator` usa o formato "Sobrenome, Nome" (ex: "Support, Sean")
- Deve ser usado exatamente como aparece na API, incluindo vírgula e espaço
- Útil para filtrar pedidos por responsável

---

## Payment Terms (Termos de Pagamento)

### Exemplo 1: Termos de pagamento ativos com select

**Nome do exemplo**: "Show me all of the active payment terms"

**Query completa**: 
```
GET /api/v1.0/odata/payment_term?$select=id,name,active&$filter=active eq true
```

**Parâmetros**:
- `$select`: `id,name,active`
- `$filter`: `active eq true`

**Descrição**: Retorna apenas os termos de pagamento ativos, selecionando apenas os campos especificados.

**Campos identificados**:
- `id`: Identificador do termo de pagamento
- `name`: Nome do termo de pagamento
- `active`: Status ativo/inativo (boolean)

---

### Exemplo 2: Termos de pagamento ativos sem select

**Nome do exemplo**: "Test payment terms sending no columns"

**Query completa**: 
```
GET /api/v1.0/odata/payment_term?$filter=active eq true
```

**Parâmetros**:
- `$filter`: `active eq true`
- Sem `$select` especificado

**Descrição**: Quando o parâmetro `$select` não é especificado, a API retorna todos os campos disponíveis da entidade.

**Observações importantes**:
- Omitir `$select` retorna todos os campos da entidade
- Útil quando você precisa de todos os dados disponíveis
- Pode resultar em respostas maiores

---

## Padrões e Observações Gerais

### Operadores OData Utilizados

- `eq`: Igual a (ex: `active eq true`, `order_status eq 'Active Project - In-Progress'`)
- `gt`: Maior que (ex: `total gt 300000`)
- `and`: Operador lógico E (ex: `total gt 10000 and order_status eq 'Active'`)
- `or`: Operador lógico OU (ex: `status eq 'Active' or status eq 'Pending'`)

### Formato de Strings

- Strings em filtros OData devem estar entre aspas simples: `'Active Project - In-Progress'`
- Valores booleanos não usam aspas: `active eq true`

### Campos Especiais

- **`search`**: Filtro especial da API Topz para busca textual em múltiplos campos
- **`creator`**: Formato "Sobrenome, Nome" (ex: "Support, Sean")

### Valores de Status Identificados

- `order_status`: 'Active Project - In-Progress' (exemplo encontrado nos testes)

