# MCP Topz

MCP (Model Context Protocol) server for interacting with the Topz OData API.

This server allows AI assistants (such as Claude in Cursor or Claude Desktop) to query Topz API data using structured tools.

## 🚀 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Topz API key

### Install dependencies

```bash
npm install
```

### Configuration

1. Copy the example configuration file:

```bash
cp env.example .env
```

2. Edit the `.env` file with your credentials:

```env
TOPZ_API_KEY=your_api_key_here
TOPZ_BASE_URL=https://your-topz-instance.com
```

### Build

```bash
npm run build
```

## 📖 Usage

### Run the server

```bash
npm start
```

Or in development mode:

```bash
npm run dev
```

### Configuration in Cursor

Add the following configuration to the `~/.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "topz": {
      "command": "node",
      "args": ["/path/to/mcp-topz/dist/index.js"],
      "env": {
        "TOPZ_API_KEY": "your_api_key_here",
        "TOPZ_BASE_URL": "https://your-topz-instance.com"
      }
    }
  }
}
```

### Configuration in Claude Desktop

Add the following configuration to the Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "topz": {
      "command": "node",
      "args": ["/path/to/mcp-topz/dist/index.js"],
      "env": {
        "TOPZ_API_KEY": "your_api_key_here",
        "TOPZ_BASE_URL": "https://your-topz-instance.com"
      }
    }
  }
}
```

## 🛠️ Available Tools

### `get_schema`

Gets the complete schema of the Topz OData API.

**Parameters**: None

**Usage example**:
> "Show me the Topz API schema"

---

### `query_orders`

Query orders using OData syntax.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `select` | string | Fields to return, comma-separated |
| `filter` | string | OData filter |
| `top` | number | Result limit |
| `skip` | number | Results to skip (pagination) |
| `orderby` | string | Field for sorting |

**Usage examples**:

> "Show all orders"

> "Search for orders with value above $300,000"
> (filter: `total gt 300000`)

> "Find orders in progress with value greater than $10,000"
> (filter: `total gt 10000 and order_status eq 'Active Project - In-Progress'`)

> "Search for the 'Gordon Square' order"
> (filter: `search eq 'Gordon Square'`)

> "List the top 10 orders"
> (top: `10`, orderby: `total desc`)

---

### `query_payment_terms`

Query payment terms using OData syntax.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `select` | string | Fields to return, comma-separated |
| `filter` | string | OData filter |
| `top` | number | Result limit |
| `skip` | number | Results to skip (pagination) |
| `orderby` | string | Field for sorting |

**Usage examples**:

> "Show all active payment terms"
> (filter: `active eq true`)

> "List payment terms sorted by name"
> (orderby: `name asc`)

## 📚 OData Reference

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal to | `status eq 'Active'` |
| `ne` | Not equal to | `status ne 'Closed'` |
| `gt` | Greater than | `total gt 10000` |
| `ge` | Greater than or equal | `total ge 10000` |
| `lt` | Less than | `total lt 10000` |
| `le` | Less than or equal | `total le 10000` |
| `and` | Logical AND | `total gt 1000 and status eq 'Active'` |
| `or` | Logical OR | `status eq 'Active' or status eq 'Pending'` |

### Search Filter

The Topz API supports a special `search` filter for text search:

```
filter: search eq 'search term'
```

## 🏗️ Project Structure

```
mcp-topz/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server configuration
│   ├── api/
│   │   ├── client.ts         # HTTP client
│   │   └── types.ts          # TypeScript types
│   ├── tools/
│   │   ├── index.ts          # Tools export
│   │   ├── schema.ts         # Tool: get_schema
│   │   ├── orders.ts         # Tool: query_orders
│   │   └── payment-terms.ts  # Tool: query_payment_terms
│   └── utils/
│       └── odata-builder.ts  # OData utility
├── dist/                     # Compiled build
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Add new tool

1. Create a new file in `src/tools/`
2. Define the tool definition with name, description and schema
3. Implement the execution function
4. Export in `src/tools/index.ts`
5. Register in `src/server.ts`

### Available scripts

```bash
npm run build    # Compile TypeScript
npm start        # Run the compiled server
npm run dev      # Run in development mode
```

## 📝 License

MIT
