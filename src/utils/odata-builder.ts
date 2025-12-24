/**
 * OData Query Builder Utility
 */

import type { ODataQueryOptions } from "../api/types.js";

/**
 * Build an OData query string from options
 */
export function buildODataQuery(options: ODataQueryOptions): string {
  const params: string[] = [];

  if (options.select) {
    params.push(`$select=${encodeURIComponent(options.select)}`);
  }

  if (options.filter) {
    params.push(`$filter=${encodeURIComponent(options.filter)}`);
  }

  if (options.top !== undefined) {
    params.push(`$top=${options.top}`);
  }

  if (options.skip !== undefined) {
    params.push(`$skip=${options.skip}`);
  }

  if (options.orderby) {
    params.push(`$orderby=${encodeURIComponent(options.orderby)}`);
  }

  if (options.count) {
    params.push("$count=true");
  }

  return params.length > 0 ? `?${params.join("&")}` : "";
}

/**
 * Common OData filter expressions builder
 */
export const ODataFilters = {
  /**
   * Equal to
   */
  eq: (field: string, value: string | number | boolean): string => {
    if (typeof value === "string") {
      return `${field} eq '${value}'`;
    }
    return `${field} eq ${value}`;
  },

  /**
   * Not equal to
   */
  ne: (field: string, value: string | number | boolean): string => {
    if (typeof value === "string") {
      return `${field} ne '${value}'`;
    }
    return `${field} ne ${value}`;
  },

  /**
   * Greater than
   */
  gt: (field: string, value: number): string => {
    return `${field} gt ${value}`;
  },

  /**
   * Greater than or equal
   */
  ge: (field: string, value: number): string => {
    return `${field} ge ${value}`;
  },

  /**
   * Less than
   */
  lt: (field: string, value: number): string => {
    return `${field} lt ${value}`;
  },

  /**
   * Less than or equal
   */
  le: (field: string, value: number): string => {
    return `${field} le ${value}`;
  },

  /**
   * Combine filters with AND
   */
  and: (...filters: string[]): string => {
    return filters.join(" and ");
  },

  /**
   * Combine filters with OR
   */
  or: (...filters: string[]): string => {
    return `(${filters.join(" or ")})`;
  },

  /**
   * Search filter (custom Topz filter)
   */
  search: (value: string): string => {
    return `search eq '${value}'`;
  },
};


