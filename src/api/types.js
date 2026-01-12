/**
 * Types for the Topz OData API
 * 
 * Note: In JavaScript, we don't have interfaces, but we document the expected structure
 * in JSDoc comments for reference.
 */

/**
 * @typedef {Object} ODataQueryOptions
 * @property {string} [select]
 * @property {string} [filter]
 * @property {number} [top]
 * @property {number} [skip]
 * @property {string} [orderby]
 * @property {boolean} [count]
 */

/**
 * @typedef {Object} ODataResponse
 * @template T
 * @property {number} totalSize
 * @property {boolean} done
 * @property {T[]} objects
 */

/**
 * @typedef {Object} Order
 * @property {string|number} id
 * @property {string} [name]
 * @property {string} [customer]
 * @property {string} [order_status]
 * @property {number} [total]
 * @property {number} [cost]
 * @property {number} [sales_tax]
 * @property {string} [creator]
 * @property {unknown} [key]
 */

/**
 * @typedef {Object} PaymentTerm
 * @property {string|number} id
 * @property {string} [name]
 * @property {boolean} [active]
 * @property {unknown} [key]
 */

/**
 * @typedef {Object} ApiError
 * @property {Object} error
 * @property {string} error.code
 * @property {string} error.message
 * @property {unknown} [error.details]
 */

/**
 * @typedef {Object} TopzApiConfig
 * @property {string} baseUrl
 * @property {string} apiKey
 */

// Export empty object for compatibility with imports
export {};
