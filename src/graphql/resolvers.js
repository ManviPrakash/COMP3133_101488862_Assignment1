const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

const User = require("../models/User");
const Employee = require("../models/Employee");

const { signToken, requireAuth } = require("./auth");
const userV = require("../validators/userValidators");
const empV = require("../validators/employeeValidators");

// Simple Date scalar
const { GraphQLScalarType, Kind } = require("graphql");
const DateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) { return new Date(value); },
  serialize(value) { return value instanceof Date ? value.toISOString() : value; },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});

async function uploadBase64ToCloudinary(base64, folder = "comp3133_employees") {
  if (!base64) return "";
  const res = await cloudinary.uploader.upload(base64, { folder });
  return res.secure_url; // store URL
}

function throwCode(message, code = "BAD_REQUEST") {
  const err = new Error(message);
  err.extensions = { code };
  throw err;
}

module.exports = {
  Date: DateScalar,

  Query: {
    login: async (_, { input }) => {
      await userV.runValidation(userV.loginRules, input);

      const { login, password } = input;
      const user = await User.findOne({
        $or: [{ username: login }, { email: login.toLowerCase() }],
      });

      if (!user) {
        throwCode("Invalid credentials", "UNAUTHENTICATED");
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        throwCode("Invalid credentials", "UNAUTHENTICATED");
      }

      const token = signToken({ _id: user._id, username: user.username, email: user.email });

      return {
        success: true,
        message: "Login successful",
        token,
        user,
      };
    },

    getAllEmployees: async (_, __, context) => {
      // Optional JWT security:
      // requireAuth(context);

      const employees = await Employee.find().sort({ created_at: -1 });
      return { success: true, message: "Employees fetched", employees };
    },

    searchEmployeeByEid: async (_, { eid }, context) => {
      // requireAuth(context);

      if (!mongoose.isValidObjectId(eid)) {
        throwCode("Invalid employee id (eid)", "BAD_USER_INPUT");
      }

      const employee = await Employee.findById(eid);
      if (!employee) {
        return { success: false, message: "Employee not found", employee: null };
      }
      return { success: true, message: "Employee found", employee };
    },

    searchEmployeesByDesignationOrDepartment: async (_, { designation, department }, context) => {
      // requireAuth(context);

      if (!designation && !department) {
        throwCode("Provide designation or department", "BAD_USER_INPUT");
      }

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      const employees = await Employee.find(filter).sort({ created_at: -1 });
      return { success: true, message: "Filtered employees fetched", employees };
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      await userV.runValidation(userV.signupRules, input);

      const username = input.username.trim();
      const email = input.email.toLowerCase().trim();

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        throwCode("username or email already exists", "BAD_USER_INPUT");
      }

      const hashed = await bcrypt.hash(input.password, 10);
      const user = await User.create({ username, email, password: hashed });

      const token = signToken({ _id: user._id, username: user.username, email: user.email });

      return {
        success: true,
        message: "Signup successful",
        token,
        user,
      };
    },

    addNewEmployee: async (_, { input }, context) => {
      // requireAuth(context);

      await empV.runValidation(empV.addEmployeeRules, input);

      const email = input.email.toLowerCase().trim();

      const exists = await Employee.findOne({ email });
      if (exists) {
        throwCode("Employee email already exists", "BAD_USER_INPUT");
      }

      let photoUrl = "";
      if (input.employee_photo_base64) {
        photoUrl = await uploadBase64ToCloudinary(input.employee_photo_base64);
      }

      const employee = await Employee.create({
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
        email,
        gender: input.gender,
        designation: input.designation.trim(),
        salary: input.salary,
        date_of_joining: new Date(input.date_of_joining),
        department: input.department.trim(),
        employee_photo: photoUrl,
      });

      return { success: true, message: "Employee created", employee };
    },

    updateEmployeeByEid: async (_, { eid, input }, context) => {
      // requireAuth(context);

      if (!mongoose.isValidObjectId(eid)) {
        throwCode("Invalid employee id (eid)", "BAD_USER_INPUT");
      }

      await empV.runValidation(empV.updateEmployeeRules, input);

      const update = { ...input };

      if (update.email) update.email = update.email.toLowerCase().trim();
      if (update.first_name) update.first_name = update.first_name.trim();
      if (update.last_name) update.last_name = update.last_name.trim();
      if (update.designation) update.designation = update.designation.trim();
      if (update.department) update.department = update.department.trim();

      // handle photo update
      if (update.employee_photo_base64) {
        update.employee_photo = await uploadBase64ToCloudinary(update.employee_photo_base64);
        delete update.employee_photo_base64;
      } else {
        delete update.employee_photo_base64;
      }

      // if email changed, ensure unique
      if (update.email) {
        const dup = await Employee.findOne({ email: update.email, _id: { $ne: eid } });
        if (dup) throwCode("Employee email already exists", "BAD_USER_INPUT");
      }

      const employee = await Employee.findByIdAndUpdate(eid, update, { new: true });
      if (!employee) {
        return { success: false, message: "Employee not found", employee: null };
      }

      return { success: true, message: "Employee updated", employee };
    },

    deleteEmployeeByEid: async (_, { eid }, context) => {
      // requireAuth(context);

      if (!mongoose.isValidObjectId(eid)) {
        throwCode("Invalid employee id (eid)", "BAD_USER_INPUT");
      }

      const deleted = await Employee.findByIdAndDelete(eid);
      if (!deleted) {
        return { success: false, message: "Employee not found" };
      }
      return { success: true, message: "Employee deleted" };
    },
  },
};
