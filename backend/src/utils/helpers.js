/**
 * Utility helpers shared across controllers and services.
 */

/**
 * Wrap an async route handler to catch errors and forward to next().
 * Eliminates repetitive try/catch in every controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a standard API success response.
 */
function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Create a standard API error response.
 */
function failure(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

/**
 * Paginate an array (for future list endpoints).
 */
function paginate(array, page = 1, limit = 20) {
  const start = (page - 1) * limit;
  const items = array.slice(start, start + limit);
  return {
    items,
    total:      array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
    hasNext:    start + limit < array.length,
    hasPrev:    page > 1,
  };
}

/**
 * Strip undefined/null keys from an object before Prisma writes.
 */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  );
}

/**
 * Sanitise a string: trim and collapse internal whitespace.
 */
function sanitiseStr(s) {
  return typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : '';
}

module.exports = { asyncHandler, success, failure, paginate, compact, sanitiseStr };
