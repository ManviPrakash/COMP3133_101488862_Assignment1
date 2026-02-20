const { body, validationResult } = require("express-validator");

// We are NOT using express routes, but we can reuse the same validators logic.
// We'll call these rules manually (run) in resolvers.

const signupRules = [
  body("username").isLength({ min: 3 }).withMessage("username must be at least 3 chars"),
  body("email").isEmail().withMessage("invalid email"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 chars"),
];

const loginRules = [
  body("login").notEmpty().withMessage("username/email is required"),
  body("password").notEmpty().withMessage("password is required"),
];

async function runValidation(rules, data) {
  // Fake req object for express-validator
  const req = { body: data };
  for (const rule of rules) {
    await rule.run(req);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join(", ");
    const err = new Error(msg);
    err.code = "BAD_USER_INPUT";
    throw err;
  }
}

module.exports = { signupRules, loginRules, runValidation };
