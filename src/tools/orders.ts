/**
 * Tool: Query Orders
 * Query orders using OData syntax
 */

import { z } from "zod";
import type { TopzApiClient } from "../api/client.js";

export const queryOrdersToolDefinition = {
  name: "query_orders",
  description: `Consulta pedidos (orders) na API Topz usando sintaxe OData.

Exemplos de uso:
- Buscar todos os pedidos: não passe nenhum parâmetro
- Selecionar campos específicos: select="id,name,customer,total"
- Filtrar por valor: filter="total gt 300000" (pedidos > $300.000)
- Filtrar por status: filter="order_status eq 'Active Project - In-Progress'"
- Buscar por texto: filter="search eq 'Gordon Square'"
- Combinar filtros: filter="total gt 10000 and order_status eq 'Active Project - In-Progress'"
- Ordenar: orderby="total desc"
- Limitar resultados: top=10
- Paginar: skip=20, top=10

Operadores de filtro disponíveis:
- eq: igual a
- ne: diferente de
- gt: maior que
- ge: maior ou igual
- lt: menor que
- le: menor ou igual
- and: combina condições (E)
- or: combina condições (OU)`,
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

