/**
 * Tool: Query Payment Terms
 * Query payment terms using OData syntax
 */

import { z } from "zod";

export const queryPaymentTermsToolDefinition = {
  name: "query_payment_terms",
  description: `Consulta termos de pagamento (payment terms) na API Topz usando sintaxe OData.

EXEMPLOS DE USO BASEADOS EM CONSULTAS REAIS DA API:

1. Termos de pagamento ativos com select:
   filter="active eq true"
   select="id,name,active"
   Descrição: Retorna apenas os termos de pagamento ativos, selecionando apenas os campos especificados.

2. Termos de pagamento ativos sem select:
   filter="active eq true"
   (sem parâmetro select)
   Descrição: Quando o parâmetro select não é especificado, a API retorna todos os campos disponíveis da entidade.
   IMPORTANTE: Omitir select retorna todos os campos da entidade. Útil quando você precisa de todos os dados disponíveis, mas pode resultar em respostas maiores.

CAMPOS DISPONÍVEIS (identificados nos exemplos):
- id: Identificador do termo de pagamento
- name: Nome do termo de pagamento
- active: Status ativo/inativo (boolean)

OPERADORES DE FILTRO:
- eq: igual a (ex: active eq true)
- ne: diferente de
- and: combina condições (E) - ex: active eq true and name ne 'Test'
- or: combina condições (OU) - ex: active eq true or active eq false

FORMATO DE VALORES:
- Valores booleanos não usam aspas: active eq true (não 'true')
- Strings em filtros OData devem estar entre aspas simples: name eq 'Net 30'

PAGINAÇÃO E ORDENAÇÃO:
- top: Limite de resultados (ex: top=10)
- skip: Resultados a pular (ex: skip=20, top=10 para página 3)
- orderby: Ordenação (ex: orderby="name asc" ou orderby="id desc")`,
  inputSchema: {
    type: "object",
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
    required: [],
  },
};

export const queryPaymentTermsInputSchema = z.object({
  select: z.string().optional(),
  filter: z.string().optional(),
  top: z.number().optional(),
  skip: z.number().optional(),
  orderby: z.string().optional(),
});

export async function executePaymentTermsTool(client, input) {
  try {
    const result = await client.queryPaymentTerms({
      select: input.select,
      filter: input.filter,
      top: input.top,
      skip: input.skip,
      orderby: input.orderby,
    });

    // Topz API returns: { totalSize: number, done: boolean, objects: PaymentTerm[] }
    const paymentTerms = result.objects || [];
    const count = paymentTerms.length;
    const totalSize = result.totalSize || count;
    const done = result.done ?? true;
    
    const summary = `Found ${count} payment term(s)${totalSize !== count ? ` out of ${totalSize} total` : ''}.`;

    return JSON.stringify(
      {
        summary,
        count,
        totalSize,
        done,
        data: paymentTerms,
      },
      null,
      2
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to query payment terms: ${error.message}`);
    }
    throw error;
  }
}
