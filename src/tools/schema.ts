/**
 * Tool: Get Schema
 * Retrieves the complete API schema from Topz
 */

import { z } from "zod";
import type { TopzApiClient } from "../api/client.js";

export const getSchemaToolDefinition = {
  name: "get_schema",
  description:
    "Obtém o schema completo da API OData da Topz. Útil para descobrir quais entidades e campos estão disponíveis para consulta.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [] as string[],
  },
};

export const getSchemaInputSchema = z.object({});

export type GetSchemaInput = z.infer<typeof getSchemaInputSchema>;

export async function executeSchemaTool(
  client: TopzApiClient
): Promise<string> {
  try {
    const schema = await client.getSchema();
    return JSON.stringify(schema, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Falha ao obter schema: ${error.message}`);
    }
    throw error;
  }
}

