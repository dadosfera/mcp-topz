# Prompt Examples - MCP Topz

This document contains examples of prompts you can use in the chat to query the Topz API via MCP. Each example includes the suggested prompt, the corresponding OData query, and a preview of the expected response format.

---

## 📋 Index

1. [API Schema](#1-get-schema)
2. [Orders](#orders)
   - [List all orders](#2-show-me-all-orders)
   - [Orders over $300,000](#3-show-me-all-orders-over-300000)
   - [Orders over $10K in progress](#4-show-me-all-orders-over-10k-in-progress)
   - [Search order by text](#5-find-the-gordon-square-order)
   - [Orders with high amounts (AND/OR)](#6-show-me-orders-with-high-amounts)
   - [Orders created by someone](#7-show-me-all-orders-created-by-someone)
3. [Payment Terms](#payment-terms)
   - [Active payment terms](#8-show-me-all-of-the-active-payment-terms)
   - [Active payment terms (without select)](#9-test-payment-terms-sending-no-columns)

---

## 1. Get Schema

### Suggested Prompt
```
Get Schema
```
or
```
Show me the API schema
```
or
```
What is the schema of the Topz API?
```

### OData Query
```
GET /api/v1.0/schema
```

### Expected Response
```json
{
  "summary": "Schema retrieved successfully",
  "data": {
    "EntitySets": [...],
    "EntityTypes": [...],
    "Functions": [...],
    "Actions": [...]
  }
}
```

**Description**: Returns the complete schema of the Topz OData API, including all available entities, types, functions, and actions.

---

## Orders

### 2. Show me all orders

### Suggested Prompt
```
Show me all orders
```
or
```
List all orders
```
or
```
Get all orders with id, name, customer, order_status, and total
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total
```

### Expected Response
```json
{
  "summary": "Found 150 order(s).",
  "count": 150,
  "data": [
    {
      "id": "12345",
      "name": "Project ABC",
      "customer": "Customer XYZ",
      "order_status": "Active Project - In-Progress",
      "total": 125000.50
    },
    {
      "id": "12346",
      "name": "Project DEF",
      "customer": "Customer ABC",
      "order_status": "Completed",
      "total": 85000.00
    }
    // ... more orders
  ]
}
```

**Description**: Returns all orders with only the specified fields (id, name, customer, order_status, total). Useful to reduce response size.

---

### 3. Show me all orders over $300,000

### Suggested Prompt
```
Show me all orders over $300,000
```
or
```
List orders with total greater than 300000
```
or
```
Find orders where total is greater than 300000
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 300000
```

### Expected Response
```json
{
  "summary": "Found 5 order(s).",
  "count": 5,
  "data": [
    {
      "id": "12345",
      "name": "Large Project A",
      "customer": "Premium Customer",
      "order_status": "Active Project - In-Progress",
      "total": 450000.00
    },
    {
      "id": "12350",
      "name": "Large Project B",
      "customer": "VIP Customer",
      "order_status": "Active Project - In-Progress",
      "total": 380000.75
    }
    // ... more orders over $300,000
  ]
}
```

**Description**: Filters orders with total value greater than $300,000 using the `gt` (greater than) operator.

**⚠️ Important**: When mentioning monetary values like "$300,000" or "$300.000", the MCP automatically converts to `300000` (unformatted number).

---

### 4. Show me all orders over $10K in progress

### Suggested Prompt
```
Show me all orders over $10K in progress
```
or
```
List orders over 10000 with status Active Project - In-Progress
```
or
```
Find orders where total is greater than 10000 and status is Active Project - In-Progress
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 10000 and order_status eq 'Active Project - In-Progress'
```

### Expected Response
```json
{
  "summary": "Found 12 order(s).",
  "count": 12,
  "data": [
    {
      "id": "12345",
      "name": "In Progress Project A",
      "customer": "Customer A",
      "order_status": "Active Project - In-Progress",
      "total": 25000.00
    },
    {
      "id": "12346",
      "name": "In Progress Project B",
      "customer": "Customer B",
      "order_status": "Active Project - In-Progress",
      "total": 15000.50
    }
    // ... more orders in progress over $10,000
  ]
}
```

**Description**: Combines two conditions using the `and` operator. Filters orders with value greater than $10,000 AND status equal to 'Active Project - In-Progress'.

**⚠️ Important**: 
- The value `10000` is a number, not a string (no quotes)
- The status `'Active Project - In-Progress'` is case-sensitive and must be exactly as it appears in the API

---

### 5. Find the 'Gordon Square' order

### Suggested Prompt
```
Find the 'Gordon Square' order
```
or
```
Search for Gordon Square
```
or
```
Show me the Gordon Square order
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=search eq 'Gordon Square'
```

### Expected Response
```json
{
  "summary": "Found 1 order(s).",
  "count": 1,
  "data": [
    {
      "id": "98765",
      "name": "Gordon Square Development",
      "customer": "Gordon Square LLC",
      "order_status": "Active Project - In-Progress",
      "total": 275000.00
    }
  ]
}
```

**Description**: Uses the special `search` filter for text search. This is a special Topz API filter that allows searching by text across multiple order fields.

**⚠️ Important**: 
- The `search` field is a special Topz API filter, not a real entity field
- Allows text search across multiple fields (name, customer, etc.)
- Useful for finding orders when you don't know the exact field

---

### 6. Show me orders with high amounts (and/or)

### Suggested Prompt
```
Show me orders where both sell and cost are above $20,000 or sales tax is more than $3K
```
or
```
List orders with (total gt 20000 and cost gt 20000) or sales_tax gt 3000
```
or
```
Find orders where total and cost are both above 20000 or sales tax is above 3000
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=(total gt 20000 and cost gt 20000) or sales_tax gt 3000
```

### Expected Response
```json
{
  "summary": "Found 8 order(s).",
  "count": 8,
  "data": [
    {
      "id": "12345",
      "name": "High Value Project A",
      "customer": "Customer A",
      "order_status": "Active Project - In-Progress",
      "cost": 25000.00,
      "sales_tax": 2500.00,
      "total": 27500.00
    },
    {
      "id": "12350",
      "name": "High Tax Project",
      "customer": "Customer B",
      "order_status": "Completed",
      "cost": 15000.00,
      "sales_tax": 3500.00,
      "total": 18500.00
    }
    // ... more orders that meet the criteria
  ]
}
```

**Description**: Demonstrates use of parentheses to group conditions and combine `and` and `or` operators. Returns orders where:
- (total > $20,000 AND cost > $20,000) OR
- sales_tax > $3,000

**Additional fields**:
- `cost`: Order cost
- `sales_tax`: Sales tax

**⚠️ Important**: 
- Parentheses are necessary to control the precedence of logical operators
- "$20,000" should be converted to `20000`
- "$3K" or "$3,000" should be converted to `3000`

---

### 7. Show me all orders created by someone

### Suggested Prompt
```
Show me all orders created by Sean Support
```
or
```
List orders created by Support, Sean
```
or
```
Find orders where creator is Support, Sean
```

### OData Query
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=creator eq 'Support, Sean'
```

### Expected Response
```json
{
  "summary": "Found 3 order(s).",
  "count": 3,
  "data": [
    {
      "id": "12345",
      "name": "Project Created by Sean",
      "customer": "Customer A",
      "order_status": "Active Project - In-Progress",
      "cost": 15000.00,
      "sales_tax": 1500.00,
      "total": 16500.00
    },
    {
      "id": "12350",
      "name": "Another Sean Project",
      "customer": "Customer B",
      "order_status": "Completed",
      "cost": 20000.00,
      "sales_tax": 2000.00,
      "total": 22000.00
    }
    // ... more orders created by Sean Support
  ]
}
```

**Description**: Filters orders by creator using the `creator` field.

**⚠️ Important**: 
- The `creator` field uses the format "Lastname, Firstname" (ex: "Support, Sean")
- Must be used exactly as it appears in the API, including comma and space
- Useful for filtering orders by responsible person

---

## Payment Terms

### 8. Show me all of the active payment terms

### Suggested Prompt
```
Show me all of the active payment terms
```
or
```
List all active payment terms
```
or
```
Get active payment terms with id, name, and active status
```

### OData Query
```
GET /api/v1.0/odata/payment_term?$select=id,name,active&$filter=active eq true
```

### Expected Response
```json
{
  "summary": "Found 5 payment term(s).",
  "count": 5,
  "data": [
    {
      "id": "1",
      "name": "Net 30",
      "active": true
    },
    {
      "id": "2",
      "name": "Net 60",
      "active": true
    },
    {
      "id": "3",
      "name": "Due on Receipt",
      "active": true
    }
    // ... more active payment terms
  ]
}
```

**Description**: Returns only active payment terms, selecting only the specified fields (id, name, active).

**Fields**:
- `id`: Payment term identifier
- `name`: Payment term name
- `active`: Active/inactive status (boolean)

---

### 9. Test payment terms sending no columns

### Suggested Prompt
```
Show me all active payment terms with all fields
```
or
```
Get all active payment terms without selecting specific columns
```
or
```
List active payment terms with all available data
```

### OData Query
```
GET /api/v1.0/odata/payment_term?$filter=active eq true
```

### Expected Response
```json
{
  "summary": "Found 5 payment term(s).",
  "count": 5,
  "data": [
    {
      "id": "1",
      "name": "Net 30",
      "active": true,
      "description": "Payment due within 30 days",
      "days": 30,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
      // ... all available fields
    },
    {
      "id": "2",
      "name": "Net 60",
      "active": true,
      "description": "Payment due within 60 days",
      "days": 60,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
      // ... all available fields
    }
    // ... more active payment terms with all fields
  ]
}
```

**Description**: When the `$select` parameter is not specified, the API returns all available fields of the entity.

**⚠️ Important**: 
- Omitting `$select` returns all entity fields
- Useful when you need all available data
- May result in larger responses

---

## 📝 Important Notes

### Monetary Value Conversion
When you mention monetary values like "$300,000" or "$300.000", the MCP automatically converts to an unformatted number: `300000`.

### Case-Sensitivity
Status values like `'Active Project - In-Progress'` are case-sensitive and must be exactly as they appear in the API.

### Creator Format
The `creator` field uses the format "Lastname, Firstname" (ex: "Support, Sean").

### Search Filter
The `search` filter is special to the Topz API and allows text search across multiple fields.

### Parentheses in Complex Filters
Use parentheses to control the precedence of logical operators: `(total gt 20000 and cost gt 20000) or sales_tax gt 3000`.

### Available OData Operators
- `eq`: equal to
- `ne`: not equal to
- `gt`: greater than
- `ge`: greater than or equal
- `lt`: less than
- `le`: less than or equal
- `and`: combines conditions (AND)
- `or`: combines conditions (OR)

### String Format
- Strings in OData filters must be between single quotes: `'Active Project - In-Progress'`
- Boolean values don't use quotes: `active eq true`
- Numbers don't use quotes: `total gt 300000`

---

## 🔍 Usage Tips

1. **Be specific**: The more specific the prompt, the better the MCP will be able to build the correct query.

2. **Use numeric values**: When mentioning monetary values, the MCP converts automatically, but you can also use numbers directly: "orders over 300000".

3. **Combine conditions**: You can combine multiple conditions using "and" and "or" in your prompt.

4. **Text search**: Use the `search` filter when you don't know the exact field to search.

5. **Select fields**: Specify which fields you need to reduce response size.

---

## 📚 References

- [OData Documentation](https://www.odata.org/documentation/)
- [Topz API Postman Collection](./Topz%20-%20OData%20API.postman_collection.json)
- [OData Query Examples](./examples/postman-examples.md)
