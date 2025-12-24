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
  order_status?: string;
  total?: number;
  cost?: number;
  sales_tax?: number;
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


