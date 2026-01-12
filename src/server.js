/**
 * MCP Server for Topz OData API
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { TopzApiClient } from "./api/client.js";
import {
  getSchemaToolDefinition,
  getSchemaInputSchema,
  executeSchemaTool,
  queryOrdersToolDefinition,
  queryOrdersInputSchema,
  executeOrdersTool,
  queryPaymentTermsToolDefinition,
  queryPaymentTermsInputSchema,
  executePaymentTermsTool,
} from "./tools/index.js";

export function createServer(config) {
  const server = new Server(
    {
      name: "mcp-topz",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize API client
  const apiClient = new TopzApiClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        getSchemaToolDefinition,
        queryOrdersToolDefinition,
        queryPaymentTermsToolDefinition,
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "get_schema": {
          getSchemaInputSchema.parse(args);
          const result = await executeSchemaTool(apiClient);
          return {
            content: [{ type: "text", text: result }],
          };
        }

        case "query_orders": {
          const input = queryOrdersInputSchema.parse(args);
          const result = await executeOrdersTool(apiClient, input);
          return {
            content: [{ type: "text", text: result }],
          };
        }

        case "query_payment_terms": {
          const input = queryPaymentTermsInputSchema.parse(args);
          const result = await executePaymentTermsTool(apiClient, input);
          return {
            content: [{ type: "text", text: result }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  });

  return server;
}

export async function runServer(config) {
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is used for MCP communication)
  console.error("MCP Topz server running on stdio");
}
