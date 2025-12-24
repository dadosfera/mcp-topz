/**
 * Tool: Query Payment Terms
 * Query payment terms using OData syntax
 */

import { z } from "zod";
import type { TopzApiClient } from "../api/client.js";

export const queryPaymentTermsToolDefinition = {
  name: "query_payment_terms",
  description: `Consulta termos de pagamento (payment terms) na API Topz usando sintaxe OData.

Exemplos de uso:
- Buscar todos os termos: não passe nenhum parâmetro
- Buscar termos ativos: filter="active eq true"
- Selecionar campos: select="id,name,active"
- Ordenar por nome: orderby="name asc"

Operadores de filtro disponíveis:
- eq: igual a
- ne: diferente de
- and: combina condições (E)
- or: combina condições (OU)`,
  inputSchema: {
    type: "object" as const,
    properties: {
      select: {
        type: "string",
        description:
          "Campos a retornar, separados por vírgula. Ex: 'id,name,active'",
      },
      filter: {
        type: "string",
        description: "Filtro OData. Ex: 'active eq true'",
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
        description: "Campo para ordenação. Ex: 'name asc'",
      },
    },
    required: [] as string[],
  },
};

export const queryPaymentTermsInputSchema = z.object({
  select: z.string().optional(),
  filter: z.string().optional(),
  top: z.number().optional(),
  skip: z.number().optional(),
  orderby: z.string().optional(),
});

export type QueryPaymentTermsInput = z.infer<typeof queryPaymentTermsInputSchema>;

export async function executePaymentTermsTool(
  client: TopzApiClient,
  input: QueryPaymentTermsInput
): Promise<string> {
  try {
    const result = await client.queryPaymentTerms({
      select: input.select,
      filter: input.filter,
      top: input.top,
      skip: input.skip,
      orderby: input.orderby,
    });

    const count = result.value?.length ?? 0;
    const summary = `Encontrados ${count} termo(s) de pagamento.`;

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
      throw new Error(`Falha ao consultar termos de pagamento: ${error.message}`);
    }
    throw error;
  }
}


