# Searchable Enterprise Directory

## Overview

A React web application to allow employees to search an enterprise-wide employee directory. The directory includes:

- Name
- Phone number
- Job role
- Work location
- Salary

Salary is confidential information so:

- Any employee can view their own salary.
- An employee's manager can view the salary of any of their direct reports.
- An employee in the HR role can view anyone's salary.

Building the Application

- Mongo DB backend data.
- node.js to build a web service to read and write data.
- Build the web application in React.

## Data Analysis

Create a solution that predicts salary based on job role and location.

- Create a script that generates and populates the database with a minimum of 1000 records of dummy data.
- Train a sklearn.linear_model.LinearRegression model to predict salary based on job role and location.
- Create a React component that can take job role and location as input and pass that to the model using a RESTful service. Display the returned predicted salary.

TIP: Investigate using the python-shell npm package in Express to call Python from JavaScript. Another option is to use Flask to create the RESTful service.

# 📘 API Endpoints – Enterprise Employee Directory

---

## 🔐 Authentication

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| POST   | `/api/auth/register`        | Register a new user (HR/Admin only) |
| POST   | `/api/auth/login`           | Log in a user, return JWT/token     |
| POST   | `/api/auth/logout`          | Log out a user, clear JWT/token     |
| POST   | `/api/auth/change-password` | Change password                     |
| POST   | `/api/auth/refresh-token`   | Refresh token                       |

---

## 👤 User Profile

| Method | Endpoint                              | Description                   |
| ------ | ------------------------------------- | ----------------------------- |
| GET    | `/api/user-details/me`                | Get logged-in user’s profile  |
| PATCH  | `/api/user-details/update-me`         | update logged-user's profile  |
| GET    | `/api/user-details/employees/:userId` | Get specific employee details |

---

## 👥 Employee Management (HR/Admin only)

| Method | Endpoint                              | Description                                         |
| ------ | ------------------------------------- | --------------------------------------------------- |
| GET    | `/api/user-details/employees`         | Get all employees (salary displayed based on roles) |
| GET    | `/api/user-details/managers`          | Get only managers (withour salary data)             |
| GET    | `/api/user-details/hrs`               | Get only hrs (withour salary datas)                 |
| POST   | `/api/auth/register`                  | Create a new employee                               |
| DELETE | `/api/user-details/employees/:userId` | Delete an employee (optional)                       |
| PATCH  | `/api/user-details/employee/:userId`  | Update user's role, salary, manager, Job title      |

---

## 🔍 Search / Utilities

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/employees/search?q=<query>` | Search employees by name, role, etc. |
