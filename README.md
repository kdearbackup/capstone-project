# Enterprise Employee Directory - Full Stack Documentation

This document provides all the necessary information to set up, run, and understand the frontend and backend components of the Enterprise Employee Directory application.

---

## 🚀 Frontend (Client)

The frontend is a modern Single Page Application (SPA) built with React that provides the user interface for the directory.

### Overview

A React web application to allow employees to search an enterprise-wide employee directory. The directory includes:

- Name
- Phone number
- Job role
- Job Title
- Work location
- Salary

Salary is confidential information so:

- Any employee can view their own salary.
- An employee's manager can view the salary of any of their direct reports.
- An employee in the HR role can view anyone's salary.

### Building the Application

- Mongo DB backend data.
- node.js to build a web service to read and write data.
- Build the web application in React.

### Data Analysis & Salary Prediction

This feature predicts an employee's salary based on their job role, job title and location. The implementation consists of several parts:

- **Data Generation:** A script is included to generate and populate the database with a minimum of 1000 records of dummy employee data for model training.
- **Machine Learning Model:** A `sklearn.linear_model.LinearRegression` model is trained to predict salary based on job role and location.
- **Prediction UI:** A React component provides an interface to input a job role and location. This data is sent to the backend via a RESTful service, and the component displays the returned predicted salary.

### Tech Stack

- **Framework**: React (with Vite)
- **Language**: JavaScript
- **Styling**: Tailwind CSS with DaisyUI for components and theming.
- **Routing**: React Router DOM
- **API Communication**: Native Browser `fetch` API
- **State Management**: React Context API
- **Notifications**: SweetAlert2

### Frontend Installation

To get the client running, follow these steps from the project's root directory:

**Navigate to the client directory**:

```bash
cd client
```

**Install all required npm packages**:

```bash
npm install
```

**Run the development server**:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## ⚙️ Backend (Server)

The backend is a Node.js application that serves a RESTful API to manage authentication, user data, and business logic. For detailed endpoint documentation, please see the `API_DOCUMENTATION.md` file.

### Tech Stack

- **Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) stored in secure `HttpOnly` cookies.
- **Password Hashing**: bcrypt

### Backend Installation

#### 1. Environment Setup (Crucial First Step)

Before running the server, you **must** create a `.env` file in the root of the `server` directory. This file will store all your secret keys and configuration variables.

Create the file `server/.env` and populate it with the following variables.

```env
# --- Server Configuration ---
PORT=4000
NODE_ENV=development

# --- Database Configuration ---
# Your MongoDB connection string
DATABASE_URL=mongodb_connection_URI

# --- Security & Authentication ---
# The cost factor for hashing passwords
BCRYPT_SALT_ROUNDS=bcrypt_salt_rounds

# Secret keys for signing JWTs (use strong, random strings)
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key

# How long the tokens should be valid for (e.g., 1d, 7d, 15m)
JWT_ACCESS_TOKEN_EXPIRES_IN=1d
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# --- Frontend URI ---
# The base URL of your running frontend application for CORS
FRONT_END_BASE_URI=http://localhost:5173
```

#### 2. Package Installation

Navigate to the server directory and install its dependencies.

1.**Navigate to the server directory:**

```bash
cd server
```

2.**Install all required npm packages:**

```bash
npm install
```

3.**Run the development server:**

```bash
npm run start:dev
```

The API server will be available at `http://localhost:4000`.

---

## 📖 API Endpoint Documentation

The following tables describe all available API endpoints.

### Authentication

| Method | Endpoint                    | Description                                                                                   | Access |
| :----- | :-------------------------- | :-------------------------------------------------------------------------------------------- | :----- |
| `POST` | `/api/auth/login`           | Logs in a user and sets `HttpOnly` cookies. Returns user info and `needsPasswordChange` flag. | Public |
| `POST` | `/api/auth/register`        | Creates a new employee.                                                                       | HR     |
| `POST` | `/api/auth/logout`          | Clears the authentication cookies, logging the user out.                                      | All    |
| `POST` | `/api/auth/change-password` | Allows a logged-in user to change their password using their old password.                    | All    |

### User & Employee Management

| Method   | Endpoint                             | Description                                                                                  | Access      |
| :------- | :----------------------------------- | :------------------------------------------------------------------------------------------- | :---------- |
| `GET`    | `/api/user-details/me`               | Retrieves the profile of the currently logged-in user.                                       | All         |
| `PATCH`  | `/api/user-details/update-me`        | Allows a user to update their own non-critical profile information (name, phone, location).  | All         |
| `GET`    | `/api/user-details/employees`        | Retrieves a list of all employees with limited data.                                         | All         |
| `GET`    | `/api/user-details/employees/:id`    | Retrieves the full profile of a specific employee by their `userDetails` ID.                 | Manager, HR |
| `PATCH`  | `/api/user-details/employee/:userId` | Allows a manager or HR to update an employee's role, salary, job title, or assigned manager. | Manager, HR |
| `DELETE` | `/api/user-details/employees/:id`    | Deletes a specific employee by their ID.                                                     | Manager, HR |
| `POST`   | `/api/user-details/employees/search` | Searches for employees based on various criteria (name, email, role, etc.).                  | All         |
| `GET`    | `/api/user-details/managers`         | Retrieves a list of all users with the "manager" role. Used for dropdowns.                   | All         |
| `GET`    | `/api/user-details/manager/my-team`  | Retrieves a list of all employees that report directly to the logged-in manager.             | Manager     |

### Salary Prediction

| Method | Endpoint                     | Description                                                                          | Access |
| :----- | :--------------------------- | :----------------------------------------------------------------------------------- | :----- |
| `POST` | `/api/predict-salary/salary` | Takes a job role and location and returns an estimated salary based on the ML model. | All    |
