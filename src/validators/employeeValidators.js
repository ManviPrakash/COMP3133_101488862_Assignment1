const { body, validationResult } = require("express-validator");

const addEmployeeRules = [
  body("first_name").notEmpty().withMessage("first_name is required"),
  body("last_name").notEmpty().withMessage("last_name is required"),
  body("email").isEmail().withMessage("invalid email"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("gender must be Male/Female/Other"),
  body("designation").notEmpty().withMessage("designation is required"),
  body("salary").isFloat({ min: 1000 }).withMessage("salary must be >= 1000"),
  body("date_of_joining").notEmpty().withMessage("date_of_joining is required"),
  body("department").notEmpty().withMessage("department is required"),
];

const updateEmployeeRules = [
  // allow partial updates, but validate if provided
  body("email").optional().isEmail().withMessage("invalid email"),
  body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("gender must be Male/Female/Other"),
  body("salary").optional().isFloat({ min: 1000 }).withMessage("salary must be >= 1000"),
];

async function runValidation(rules, data) {
  const req = { body: data };
  for (const rule of rules) await rule.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join(", ");
    const err = new Error(msg);
    err.code = "BAD_USER_INPUT";
    throw err;
  }
}

module.exports = { addEmployeeRules, updateEmployeeRules, runValidation };
