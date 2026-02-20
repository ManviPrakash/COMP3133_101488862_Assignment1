const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type GenericResponse {
    success: Boolean!
    message: String!
  }

  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  type EmployeesResponse {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    login: String!   # username OR email
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo_base64: String # optional: send base64 string from Postman
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo_base64: String
  }

  type Query {
    login(input: LoginInput!): AuthResponse!
    getAllEmployees: EmployeesResponse!
    searchEmployeeByEid(eid: ID!): EmployeeResponse!
    searchEmployeesByDesignationOrDepartment(designation: String, department: String): EmployeesResponse!
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    addNewEmployee(input: EmployeeInput!): EmployeeResponse!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): EmployeeResponse!
    deleteEmployeeByEid(eid: ID!): GenericResponse!
  }
`;
