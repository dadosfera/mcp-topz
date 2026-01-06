/**
 * Types for the Topz OData API
 */

// OData query options
export interface ODataQueryOptions {
  select?: string;
  filter?: string;
  top?: number;
  skip?: number;
  orderby?: string;
  count?: boolean;
}

// Generic OData response wrapper
export interface ODataResponse<T> {
  value: T[];
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
}

// Order entity
export interface Order {
  id: string | number;
  name?: string;
  customer?: string;
  /**
   * Status do pedido.
   * Exemplo de valor: 'Active Project - In-Progress'
   * Valores são case-sensitive e devem corresponder exatamente aos valores da API.
   */
  order_status?: string;
  total?: number;
  /**
   * Custo do pedido.
   * Identificado no exemplo "Show me orders with high amounts (and/or)"
   */
  cost?: number;
  /**
   * Imposto sobre vendas.
   * Identificado no exemplo "Show me orders with high amounts (and/or)"
   */
  sales_tax?: number;
  /**
   * Criador do pedido.
   * Formato: "Sobrenome, Nome" (ex: "Support, Sean")
   * Identificado no exemplo "Show me all orders created by someone"
   */
  creator?: string;
  [key: string]: unknown; // Allow additional fields
}

// Payment Term entity
export interface PaymentTerm {
  id: string | number;
  name?: string;
  active?: boolean;
  [key: string]: unknown; // Allow additional fields
}

// API Error response
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// API Client configuration
export interface TopzApiConfig {
  baseUrl: string;
  apiKey: string;
}


