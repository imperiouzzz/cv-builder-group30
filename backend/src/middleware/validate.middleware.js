const { validationResult } = require('express-validator');

/**
 * Middleware that reads express-validator results and returns
 * a 422 with field-level error details if any validations failed.
 *
 * Usage: add after your validation chain in a route:
 *   router.post('/register', [body('email').isEmail()], validate, controller)
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
