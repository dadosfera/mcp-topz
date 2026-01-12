/**
 * Tool: Get Schema
 * Retrieves the complete API schema from Topz
 */

import { z } from "zod";

export const getSchemaToolDefinition = {
  name: "get_schema",
  description:
    "Obtém o schema completo da API OData da Topz. Útil para descobrir quais entidades e campos estão disponíveis para consulta.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const getSchemaInputSchema = z.object({});

export async function executeSchemaTool(client) {
  try {
    const schema = await client.getSchema();
    return JSON.stringify(schema, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get schema: ${error.message}`);
    }
    throw error;
  }
}
