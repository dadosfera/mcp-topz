/**
 * HTTP Client for Topz OData API
 */

import type {
  TopzApiConfig,
  ODataQueryOptions,
  ODataResponse,
  Order,
  PaymentTerm,
} from "./types.js";
import { buildODataQuery } from "../utils/odata-builder.js";

export class TopzApiClient {
  private config: TopzApiConfig;

  constructor(config: TopzApiConfig) {
    this.config = config;
  }

  /**
   * Make an authenticated request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error?.message || errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }

      throw new Error(
        `API Error (${response.status}): ${errorMessage}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get the API schema
   */
  async getSchema(): Promise<unknown> {
    return this.request<unknown>("/api/v1.0/schema");
  }

  /**
   * Query orders using OData syntax
   */
  async queryOrders(
    options: ODataQueryOptions = {}
  ): Promise<ODataResponse<Order>> {
    const queryString = buildODataQuery(options);
    const endpoint = `/api/v1.0/odata/order${queryString}`;
    return this.request<ODataResponse<Order>>(endpoint);
  }

  /**
   * Query payment terms using OData syntax
   */
  async queryPaymentTerms(
    options: ODataQueryOptions = {}
  ): Promise<ODataResponse<PaymentTerm>> {
    const queryString = buildODataQuery(options);
    const endpoint = `/api/v1.0/odata/payment_term${queryString}`;
    return this.request<ODataResponse<PaymentTerm>>(endpoint);
  }

  /**
   * Generic OData query for any entity
   */
  async queryEntity<T>(
    entityName: string,
    options: ODataQueryOptions = {}
  ): Promise<ODataResponse<T>> {
    const queryString = buildODataQuery(options);
    const endpoint = `/api/v1.0/odata/${entityName}${queryString}`;
    return this.request<ODataResponse<T>>(endpoint);
  }
}

