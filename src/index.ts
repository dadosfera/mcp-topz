#!/usr/bin/env node

/**
 * MCP Topz - Entry Point
 * 
 * This is the main entry point for the MCP server.
 * It reads configuration from environment variables and starts the server.
 */

import { runServer } from "./server.js";

// Read configuration from environment variables
const apiKey = process.env.TOPZ_API_KEY;
const baseUrl = process.env.TOPZ_BASE_URL;

// Validate required configuration
if (!apiKey) {
  console.error("Erro: TOPZ_API_KEY não está definida.");
  console.error("Por favor, configure a variável de ambiente TOPZ_API_KEY com sua chave de API.");
  process.exit(1);
}

if (!baseUrl) {
  console.error("Erro: TOPZ_BASE_URL não está definida.");
  console.error("Por favor, configure a variável de ambiente TOPZ_BASE_URL com a URL base da API.");
  process.exit(1);
}

// Start the server
runServer({
  apiKey,
  baseUrl,
}).catch((error) => {
  console.error("Erro fatal ao iniciar o servidor:", error);
  process.exit(1);
});


