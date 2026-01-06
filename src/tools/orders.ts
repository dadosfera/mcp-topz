/**
 * Tool: Query Orders
 * Query orders using OData syntax
 */

import { z } from "zod";
import type { TopzApiClient } from "../api/client.js";

export const queryOrdersToolDefinition = {
  name: "query_orders",
  description: `Consulta pedidos (orders) na API Topz usando sintaxe OData.

EXEMPLOS DE USO BASEADOS EM CONSULTAS REAIS DA API:

1. Listar todos os pedidos com campos específicos:
   select="id,name,customer,order_status,total"
   Descrição: Retorna todos os pedidos com apenas os campos especificados.

2. Pedidos acima de $300.000:
   filter="total gt 300000"
   select="id,name,customer,order_status,total"
   Descrição: Filtra pedidos com valor total maior que $300.000 usando o operador gt.

3. Pedidos acima de $10K em progresso:
   filter="total gt 10000 and order_status eq 'Active Project - In-Progress'"
   select="id,name,customer,order_status,total"
   Descrição: Combina duas condições usando o operador and. Filtra pedidos com valor maior que $10.000 E status igual a 'Active Project - In-Progress'.
   Nota: O valor de order_status deve ser exatamente como aparece na API (case-sensitive).

4. Buscar pedido por texto (busca textual):
   filter="search eq 'Gordon Square'"
   select="id,name,customer,order_status,total"
   Descrição: Usa o filtro especial 'search' para busca textual. Este é um filtro especial da API Topz que permite buscar por texto em múltiplos campos.
   IMPORTANTE: O campo 'search' é um filtro especial da API Topz, não um campo real da entidade. Permite busca textual em múltiplos campos do pedido.

5. Pedidos com valores altos (combinando condições com parênteses):
   filter="(total gt 20000 and cost gt 20000) or sales_tax gt 3000"
   select="id,name,customer,order_status,cost,sales_tax,total"
   Descrição: Demonstra uso de parênteses para agrupar condições e combinar operadores and e or. Retorna pedidos onde (total > $20.000 E cost > $20.000) OU sales_tax > $3.000.
   Nota: Parênteses são necessários para controlar a precedência dos operadores lógicos.

6. Pedidos criados por alguém:
   filter="creator eq 'Support, Sean'"
   select="id,name,customer,order_status,cost,sales_tax,total"
   Descrição: Filtra pedidos pelo criador usando o campo creator.
   IMPORTANTE: O campo creator usa o formato "Sobrenome, Nome" (ex: "Support, Sean"). Deve ser usado exatamente como aparece na API, incluindo vírgula e espaço.

7. Buscar todos os pedidos (sem filtros):
   Não passe nenhum parâmetro ou passe apenas select para limitar campos retornados.

CAMPOS DISPONÍVEIS (identificados nos exemplos):
- id: Identificador do pedido
- name: Nome do pedido
- customer: Cliente
- order_status: Status do pedido (ex: 'Active Project - In-Progress')
- total: Valor total do pedido
- cost: Custo do pedido
- sales_tax: Imposto sobre vendas
- creator: Criador do pedido (formato: "Sobrenome, Nome")

OPERADORES DE FILTRO:
- eq: igual a (ex: order_status eq 'Active Project - In-Progress')
- ne: diferente de
- gt: maior que (ex: total gt 300000)
- ge: maior ou igual
- lt: menor que
- le: menor ou igual
- and: combina condições (E) - ex: total gt 10000 and order_status eq 'Active'
- or: combina condições (OU) - ex: status eq 'Active' or status eq 'Pending'
- Parênteses para agrupar: (total gt 20000 and cost gt 20000) or sales_tax gt 3000

FILTRO ESPECIAL:
- search: Filtro especial da API Topz para busca textual em múltiplos campos (ex: search eq 'Gordon Square')

FORMATO DE STRINGS:
- Strings em filtros OData devem estar entre aspas simples: 'Active Project - In-Progress'
- Valores booleanos não usam aspas: active eq true

PAGINAÇÃO E ORDENAÇÃO:
- top: Limite de resultados (ex: top=10)
- skip: Resultados a pular (ex: skip=20, top=10 para página 3)
- orderby: Ordenação (ex: orderby="total desc" ou orderby="name asc")`,
  inputSchema: {
    type: "object" as const,
    properties: {
      select: {
        type: "string",
        description:
          "Campos a retornar, separados por vírgula. Ex: 'id,name,customer,total'",
      },
      filter: {
        type: "string",
        description:
          "Filtro OData. Ex: 'total gt 300000' ou 'order_status eq \\'Active\\''",
      },
      top: {
        type: "number",
        description: "Número máximo de resultados a retornar",
      },
      skip: {
        type: "number",
        description: "Número de resultados para pular (para paginação)",
      },
      orderby: {
        type: "string",
        description: "Campo para ordenação. Ex: 'total desc' ou 'name asc'",
      },
    },
    required: [] as string[],
  },
};

export const queryOrdersInputSchema = z.object({
  select: z.string().optional(),
  filter: z.string().optional(),
  top: z.number().optional(),
  skip: z.number().optional(),
  orderby: z.string().optional(),
});

export type QueryOrdersInput = z.infer<typeof queryOrdersInputSchema>;

export async function executeOrdersTool(
  client: TopzApiClient,
  input: QueryOrdersInput
): Promise<string> {
  try {
    const result = await client.queryOrders({
      select: input.select,
      filter: input.filter,
      top: input.top,
      skip: input.skip,
      orderby: input.orderby,
    });

    const count = result.value?.length ?? 0;
    const summary = `Encontrados ${count} pedido(s).`;

    return JSON.stringify(
      {
        summary,
        count,
        data: result.value,
        nextLink: result["@odata.nextLink"],
      },
      null,
      2
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao consultar pedidos: ${error.message}`);
    }
    throw error;
  }
}


