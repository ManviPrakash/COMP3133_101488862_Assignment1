# COMP3133 – Assignment 1
## Employee Management System (GraphQL + MongoDB)

**Student Name:** Manvi Prakash  
**Student ID:** 101488862  
**Course:** COMP3133  
**Repository:** COMP3133_101488862_Assignment1  

---

## 📌 Project Description

This project is a backend Employee Management System developed using:

- NodeJS
- Express
- GraphQL (Apollo Server)
- MongoDB Atlas
- Mongoose
- express-validator (Input Validation)
- bcryptjs (Password Encryption)
- JWT (Authentication)
- Cloudinary (Employee Profile Image Storage)

The system allows users to sign up, log in, and manage employee records using GraphQL Queries and Mutations.

---

## 🗄 Database Information

**Database Name:**

comp3133_101488862_Assigment1

### Collections:
- users
- employees

---

## 🔐 Authentication

- Users can sign up.
- Users can log in using username OR email.
- Passwords are encrypted using bcrypt.
- JWT token is generated upon successful authentication.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/ManviPrakash/COMP3133_101488862_Assignment1.git  
cd COMP3133_101488862_Assignment1  

### 2️⃣ Install Dependencies

npm install  

### 3️⃣ Create a .env File

Create a file named `.env` in the root directory and add:

PORT=4000  

MONGO_URI=your_mongodb_connection_string  

JWT_SECRET=your_secret_key  

CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  

### 4️⃣ Run the Server

npm run dev  

Server runs at:

http://localhost:4000/graphql  

---

## 🧪 API Testing

All APIs were tested using **Postman**.

### Endpoint:
POST http://localhost:4000/graphql  

### Header:
Content-Type: application/json  

---

## 📌 GraphQL Operations Implemented

### 🔹 User Operations

1. Signup (Mutation)  
2. Login (Query)  

---

### 🔹 Employee Operations

3. Get All Employees (Query)  
4. Add New Employee (Mutation)  
   - Salary validation (>= 1000)  
   - Profile image upload to Cloudinary  
5. Search Employee by ID (Query)  
6. Update Employee by ID (Mutation)  
7. Delete Employee by ID (Mutation)  
8. Search Employees by Designation or Department (Query)  

---

## 📸 Validation & Error Handling

- Required field validation  
- Email format validation  
- Salary minimum validation  
- Duplicate email prevention  
- Invalid login error handling  
- Structured JSON error responses  

---

## ☁ Cloudinary Integration

Employee profile images are uploaded to Cloudinary.  
The secure image URL is stored in the employees collection in MongoDB.

---

## 🧾 Sample User for Testing

Username: manvi2  
Email: manvi2@test.com  
Password: secret123  

---


# Created by -- Manvi Prakash