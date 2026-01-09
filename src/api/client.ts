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

    // Log request details for debugging
    console.error(`[MCP-TOPZ] Making request to: ${url}`);

    try {
      // Add timeout to fetch (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

      clearTimeout(timeoutId);

      console.error(`[MCP-TOPZ] Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MCP-TOPZ] Error response body:`, errorText.substring(0, 500));
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

      const responseText = await response.text();
      console.error(`[MCP-TOPZ] Response body length: ${responseText.length} characters`);
      
      if (responseText.length === 0) {
        console.error(`[MCP-TOPZ] WARNING: Empty response body!`);
        throw new Error("Empty response from API");
      }

      const jsonData = JSON.parse(responseText);
      
      // Topz API returns: { totalSize: number, done: boolean, objects: T[] }
      if ('objects' in jsonData) {
        const count = Array.isArray(jsonData.objects) ? jsonData.objects.length : 0;
        console.error(`[MCP-TOPZ] Response: ${count} objects, totalSize: ${jsonData.totalSize}, done: ${jsonData.done}`);
      } else {
        console.error(`[MCP-TOPZ] WARNING: Unexpected response structure. Keys:`, Object.keys(jsonData));
      }
      
      return jsonData as T;
    } catch (error) {
      // Enhanced error handling for network issues
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`[MCP-TOPZ] Request timeout after 30 seconds`);
          throw new Error(`Request timeout: Unable to reach ${url} within 30 seconds. This might be a network connectivity issue in Docker.`);
        }
        if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
          console.error(`[MCP-TOPZ] Network error:`, error.message);
          console.error(`[MCP-TOPZ] This might be a DNS resolution or network connectivity issue in Docker.`);
          console.error(`[MCP-TOPZ] Try: 1) Check if app.topz.ai is reachable from the container, 2) Check DNS resolution, 3) Check firewall/proxy settings`);
          throw new Error(`Network error: ${error.message}. URL: ${url}. Check DNS resolution and network connectivity in Docker.`);
        }
        console.error(`[MCP-TOPZ] Request error:`, error.message);
        console.error(`[MCP-TOPZ] Error stack:`, error.stack);
      }
      throw error;
    }
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
    const fullUrl = `${this.config.baseUrl}${endpoint}`;
    console.error(`[MCP-TOPZ] Query Orders - URL: ${fullUrl}`);
    console.error(`[MCP-TOPZ] Query Orders - Options:`, JSON.stringify(options, null, 2));
    const result = await this.request<ODataResponse<Order>>(endpoint);
    if (result && typeof result === 'object' && 'objects' in result) {
      console.error(`[MCP-TOPZ] Query Orders - Found ${result.objects.length} orders (totalSize: ${result.totalSize})`);
    }
    return result;
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

