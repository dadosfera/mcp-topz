/**
 * OData Query Builder Utility
 */

/**
 * Build an OData query string from options
 */
export function buildODataQuery(options) {
  const params = [];

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
  eq: (field, value) => {
    if (typeof value === "string") {
      return `${field} eq '${value}'`;
    }
    return `${field} eq ${value}`;
  },

  /**
   * Not equal to
   */
  ne: (field, value) => {
    if (typeof value === "string") {
      return `${field} ne '${value}'`;
    }
    return `${field} ne ${value}`;
  },

  /**
   * Greater than
   */
  gt: (field, value) => {
    return `${field} gt ${value}`;
  },

  /**
   * Greater than or equal
   */
  ge: (field, value) => {
    return `${field} ge ${value}`;
  },

  /**
   * Less than
   */
  lt: (field, value) => {
    return `${field} lt ${value}`;
  },

  /**
   * Less than or equal
   */
  le: (field, value) => {
    return `${field} le ${value}`;
  },

  /**
   * Combine filters with AND
   */
  and: (...filters) => {
    return filters.join(" and ");
  },

  /**
   * Combine filters with OR
   */
  or: (...filters) => {
    return `(${filters.join(" or ")})`;
  },

  /**
   * Search filter (custom Topz filter)
   */
  search: (value) => {
    return `search eq '${value}'`;
  },
};
