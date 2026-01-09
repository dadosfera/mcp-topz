# Compatible Prompts for MCP Topz

This list contains prompts that work correctly with MCP Topz, based on the Postman collection.

## Prompts for Orders

### 1. Get Schema
**Prompt**: `Get Schema` or `Show me the schema` or `What is the API schema?`
**What it does**: Returns the complete schema of the Topz OData API.

---

### 2. Show me all orders
**Prompt**: `Show me all orders` or `List all orders` or `Get all orders`
**Expected parameters**:
- `select`: `id,name,customer,order_status,total`

---

### 3. Show me all orders over $300,000
**Prompt**: `Show me all orders over $300,000` or `Show me all orders over 300000` or `List orders with total greater than 300000`
**Expected parameters**:
- `filter`: `total gt 300000` (IMPORTANT: no comma, no period, just the number)
- `select`: `id,name,customer,order_status,total`

**Note**: The LLM should convert "$300,000" or "$300.000" to `300000` (number without formatting).

---

### 4. Show me all orders over $10K in progress
**Prompt**: `Show me all orders over $10K in progress` or `Show me all orders over $10,000 that are in progress` or `List orders over 10000 with status Active Project - In-Progress`
**Expected parameters**:
- `filter`: `total gt 10000 and order_status eq 'Active Project - In-Progress'`
- `select`: `id,name,customer,order_status,total`

**Note**: 
- "$10K" or "$10,000" should be converted to `10000`
- The status `'Active Project - In-Progress'` is case-sensitive and must be exactly as it appears in the API.

---

### 5. Find the 'Gordon Square' order
**Prompt**: `Find the 'Gordon Square' order` or `Search for Gordon Square` or `Show me the Gordon Square order`
**Expected parameters**:
- `filter`: `search eq 'Gordon Square'`
- `select`: `id,name,customer,order_status,total`

**Note**: The `search` filter is a special Topz API filter that allows text search across multiple fields.

---

### 6. Show me orders with high amounts (and/or)
**Prompt**: `Show me orders where both sell and cost are above $20,000 or sales tax is more than $3K` or `List orders with (total gt 20000 and cost gt 20000) or sales_tax gt 3000`
**Expected parameters**:
- `filter`: `(total gt 20000 and cost gt 20000) or sales_tax gt 3000`
- `select`: `id,name,customer,order_status,cost,sales_tax,total`

**Note**: 
- "$20,000" should be converted to `20000`
- "$3K" or "$3,000" should be converted to `3000`
- Parentheses are necessary to control the precedence of logical operators.

---

### 7. Show me all orders created by Sean Support
**Prompt**: `Show me all orders created by Sean Support` or `List orders created by Support, Sean` or `Find orders where creator is Support, Sean`
**Expected parameters**:
- `filter`: `creator eq 'Support, Sean'`
- `select`: `id,name,customer,order_status,cost,sales_tax,total`

**Note**: The `creator` field uses the format "Lastname, Firstname" (ex: "Support, Sean"). Must be used exactly as it appears in the API, including comma and space.

---

## Prompts for Payment Terms

### 8. Show me the names of all the active payment terms
**Prompt**: `Show me the names of all the active payment terms` or `List active payment term names`
**Expected parameters**:
- `filter`: `active eq true`
- `select`: `id,name`

---

### 9. Show me all of the active payment terms
**Prompt**: `Show me all of the active payment terms` or `List all active payment terms` or `Get active payment terms`
**Expected parameters**:
- `filter`: `active eq true`
- `select`: `id,name,active`

---

## Important Tips

1. **Monetary values**: When the user mentions values like "$300,000" or "$300.000", the LLM should convert to an unformatted number: `300000`.

2. **Case-sensitive status**: Status values like `'Active Project - In-Progress'` are case-sensitive and must be exactly as they appear in the API.

3. **Creator format**: The `creator` field uses the format "Lastname, Firstname" (ex: "Support, Sean").

4. **Search filter**: The `search` filter is special to the Topz API and allows text search across multiple fields.

5. **Parentheses in complex filters**: Use parentheses to control the precedence of logical operators: `(total gt 20000 and cost gt 20000) or sales_tax gt 3000`.
