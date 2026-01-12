# OData Query Examples - Topz API

This document contains real query examples extracted from the Topz OData API Postman collection.

## Orders

### Example 1: List all orders with specific fields

**Example name**: "Show me all orders"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total
```

**Parameters**:
- `$select`: `id,name,customer,order_status,total`

**Description**: Returns all orders with only the specified fields. Useful to reduce response size when not all fields are needed.

---

### Example 2: Orders over $300,000

**Example name**: "Show me all orders over $300,000"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 300000
```

**Parameters**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `total gt 300000`

**Description**: Filters orders with total value greater than $300,000 using the `gt` (greater than) operator.

---

### Example 3: Orders over $10K in progress

**Example name**: "Show me all orders over $10K in progress"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=total gt 10000 and order_status eq 'Active Project - In-Progress'
```

**Parameters**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `total gt 10000 and order_status eq 'Active Project - In-Progress'`

**Description**: Combines two conditions using the `and` operator. Filters orders with value greater than $10,000 AND status equal to 'Active Project - In-Progress'.

**Important observations**:
- The `order_status` value must be exactly as it appears in the API (case-sensitive)
- Strings in OData filters must be between single quotes

---

### Example 4: Search order by text

**Example name**: "Find the 'Gordon Square' order"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,total&$filter=search eq 'Gordon Square'
```

**Parameters**:
- `$select`: `id,name,customer,order_status,total`
- `$filter`: `search eq 'Gordon Square'`

**Description**: Uses the special `search` filter for text search. This is a special Topz API filter that allows searching by text across multiple fields.

**Important observations**:
- The `search` field is a special Topz API filter, not a real entity field
- Allows text search across multiple order fields
- Useful for finding orders by name, customer, or other text fields

---

### Example 5: Orders with high amounts (AND/OR combination)

**Example name**: "Show me orders with high amounts (and/or)"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=(total gt 20000 and cost gt 20000) or sales_tax gt 3000
```

**Parameters**:
- `$select`: `id,name,customer,order_status,cost,sales_tax,total`
- `$filter`: `(total gt 20000 and cost gt 20000) or sales_tax gt 3000`

**Description**: Demonstrates use of parentheses to group conditions and combine `and` and `or` operators. Returns orders where:
- (total > $20,000 AND cost > $20,000) OR
- sales_tax > $3,000

**Additional identified fields**:
- `cost`: Order cost
- `sales_tax`: Sales tax

**Important observations**:
- Parentheses are necessary to control the precedence of logical operators
- Allows creating complex filters combining multiple conditions

---

### Example 6: Orders created by someone

**Example name**: "Show me all orders created by someone"

**Complete query**: 
```
GET /api/v1.0/odata/order?$select=id,name,customer,order_status,cost,sales_tax,total&$filter=creator eq 'Support, Sean'
```

**Parameters**:
- `$select`: `id,name,customer,order_status,cost,sales_tax,total`
- `$filter`: `creator eq 'Support, Sean'`

**Description**: Filters orders by creator using the `creator` field.

**Important observations**:
- The `creator` field uses the format "Lastname, Firstname" (ex: "Support, Sean")
- Must be used exactly as it appears in the API, including comma and space
- Useful for filtering orders by responsible person

---

## Payment Terms

### Example 1: Active payment terms with select

**Example name**: "Show me all of the active payment terms"

**Complete query**: 
```
GET /api/v1.0/odata/payment_term?$select=id,name,active&$filter=active eq true
```

**Parameters**:
- `$select`: `id,name,active`
- `$filter`: `active eq true`

**Description**: Returns only active payment terms, selecting only the specified fields.

**Identified fields**:
- `id`: Payment term identifier
- `name`: Payment term name
- `active`: Active/inactive status (boolean)

---

### Example 2: Active payment terms without select

**Example name**: "Test payment terms sending no columns"

**Complete query**: 
```
GET /api/v1.0/odata/payment_term?$filter=active eq true
```

**Parameters**:
- `$filter`: `active eq true`
- No `$select` specified

**Description**: When the `$select` parameter is not specified, the API returns all available fields of the entity.

**Important observations**:
- Omitting `$select` returns all entity fields
- Useful when you need all available data
- May result in larger responses

---

## Patterns and General Observations

### OData Operators Used

- `eq`: Equal to (ex: `active eq true`, `order_status eq 'Active Project - In-Progress'`)
- `gt`: Greater than (ex: `total gt 300000`)
- `and`: Logical AND operator (ex: `total gt 10000 and order_status eq 'Active'`)
- `or`: Logical OR operator (ex: `status eq 'Active' or status eq 'Pending'`)

### String Format

- Strings in OData filters must be between single quotes: `'Active Project - In-Progress'`
- Boolean values don't use quotes: `active eq true`

### Special Fields

- **`search`**: Special Topz API filter for text search across multiple fields
- **`creator`**: Format "Lastname, Firstname" (ex: "Support, Sean")

### Identified Status Values

- `order_status`: 'Active Project - In-Progress' (example found in tests)
