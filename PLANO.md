# Implementation Plan - MCP Server for Topz OData API

## 📋 Overview

This document describes the complete plan to create an MCP (Model Context Protocol) server that allows interaction with the Topz OData API through tools that can be used by AI assistants.

## 🎯 Objectives

1. Create an MCP server in TypeScript/Node.js
2. Implement tools to query the Topz OData API
3. Support Bearer Token authentication
4. Allow flexible queries using OData syntax ($select, $filter, etc.)
5. Provide complete documentation and usage examples

## 📁 Project Structure

```
mcp-topz/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── server.ts                 # Server configuration and initialization
│   ├── api/
│   │   ├── client.ts             # HTTP client for Topz API
│   │   └── types.ts              # TypeScript types for the API
│   ├── tools/
│   │   ├── schema.ts             # Tool: get API schema
│   │   ├── orders.ts             # Tool: query orders
│   │   └── payment-terms.ts      # Tool: query payment terms
│   └── utils/
│       ├── odata-builder.ts     # Utility to build OData queries
│       └── errors.ts            # Error handling
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── PLANO.md (this file)
```

## 🔧 Configuration and Dependencies

### Main Dependencies

- `@modelcontextprotocol/sdk` - Official MCP SDK
- `node-fetch` or `axios` - HTTP client
- `dotenv` - Environment variable management
- `zod` - Schema validation (optional, but recommended)

### Development Dependencies

- `typescript` - TypeScript compiler
- `@types/node` - Types for Node.js
- `tsx` or `ts-node` - Run TypeScript directly
- `eslint` - Linter (optional)
- `prettier` - Formatting (optional)

### Environment Variables

```env
TOPZ_API_KEY=your_api_key_here
TOPZ_BASE_URL=https://api.topz.com  # or API base URL
```

## 🛠️ Tool Implementation

### 1. Tool: `get_schema`
**Description**: Gets the complete OData API schema

**Parameters**: None

**Return**: API JSON schema

**Endpoint**: `GET /api/v1.0/schema`

### 2. Tool: `query_orders`
**Description**: Query orders using OData syntax

**Parameters**:
- `select` (optional): Fields to return (ex: "id,name,customer,total")
- `filter` (optional): OData filter (ex: "total gt 300000")
- `top` (optional): Result limit
- `skip` (optional): Number of results to skip
- `orderby` (optional): Field for sorting

**Return**: List of orders according to applied filters

**Endpoint**: `GET /api/v1.0/odata/order`

**Usage examples**:
- Get all orders
- Get orders with total > $300,000
- Get orders in progress with total > $10K
- Search orders by name (search)
- Get orders created by a specific person

### 3. Tool: `query_payment_terms`
**Description**: Query payment terms using OData syntax

**Parameters**:
- `select` (optional): Fields to return (ex: "id,name,active")
- `filter` (optional): OData filter (ex: "active eq true")
- `top` (optional): Result limit
- `skip` (optional): Number of results to skip
- `orderby` (optional): Field for sorting

**Return**: List of payment terms according to applied filters

**Endpoint**: `GET /api/v1.0/odata/payment_term`

## 📝 Implementation Details

### 1. HTTP Client (`src/api/client.ts`)

- `TopzApiClient` class that encapsulates all HTTP calls
- Methods for each endpoint
- HTTP error handling
- Default headers (Content-Type, Accept, Authorization)
- OData query parameter support

### 2. OData Builder (`src/utils/odata-builder.ts`)

- Utility function to build URLs with OData query parameters
- Support for:
  - `$select`
  - `$filter`
  - `$top`
  - `$skip`
  - `$orderby`
  - `$count` (if supported)

### 3. MCP Server (`src/server.ts`)

- MCP server initialization using the SDK
- Registration of all tools
- Global error handling
- Basic logging

### 4. Tools (`src/tools/*.ts`)

Each tool should:
- Validate input parameters
- Build the appropriate OData query
- Make the API call through the client
- Handle errors and return friendly messages
- Return formatted data

## 🔐 Authentication

- All requests use Bearer Token
- Token obtained from the `TOPZ_API_KEY` environment variable
- Header: `Authorization: Bearer {token}`

## 📚 Documentation

### README.md should include:

1. **Project description**
2. **Installation**
   - Prerequisites (Node.js, npm/yarn)
   - Dependency installation
   - Environment variable configuration

3. **Usage**
   - How to run the MCP server
   - How to configure in Cursor/Claude Desktop
   - Examples of using each tool

4. **API Reference**
   - Documentation for each tool
   - Accepted parameters
   - OData query examples

5. **Development**
   - How to add new tools
   - Code structure
   - How to test

## 🧪 Tests (Future)

- Unit tests for the HTTP client
- Tests for the OData builder
- Integration tests for tools
- API mock for testing

## 🚀 Next Steps

1. ✅ Create folder structure
2. ✅ Configure package.json with dependencies
3. ✅ Configure TypeScript (tsconfig.json)
4. ✅ Create .env.example and .gitignore
5. ✅ Implement basic HTTP client
6. ✅ Implement OData builder
7. ✅ Implement get_schema tool
8. ✅ Implement query_orders tool
9. ✅ Implement query_payment_terms tool
10. ✅ Configure MCP server
11. ✅ Create complete README.md
12. ✅ Test integration with Cursor/Claude Desktop

## 📌 Important Notes

- The API uses OData v4, so we should follow the OData specification
- All endpoints return JSON
- The API may have rate limiting - consider implementing retry logic
- Some fields may be optional in responses
- The `search` filter appears to be a special field for text search

## 🔄 Future Improvements (Optional)

- Automatic pagination support
- Schema caching
- Support for other OData endpoints (if available)
- More robust OData query validation
- Support for write operations (POST, PATCH, DELETE) if the API allows
- Advanced metrics and logging
