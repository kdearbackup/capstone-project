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
- A manager can view the salary of any of their direct reports.
- An employee in the HR role can view anyone's salary.

### Data Analysis & Salary Prediction

This feature predicts an employee's salary based on their job role, job title and location. The implementation consists of several parts:

- **Data Generation:** A script is included to generate and populate the database with a minimum of 1000 records of dummy employee data for model training.
- **Machine Learning Model:** A `sklearn.linear_model.LinearRegression` model is trained to predict salary based on job role and location.
- **Prediction UI:** A React component provides an interface to input a job role and location. This data is sent to the backend via a RESTful service, and the component displays the returned predicted salary.

### Application Workflow and User Roles

This section outlines the standard user lifecycle and the permissions associated with each role within the Enterprise Directory application.

#### User Onboarding and First Login

The system is designed with a secure onboarding process for new employees.

1.  **Registration by HR:** An employee's journey begins when a member of the Human Resources (HR) department registers them in the system. Employees cannot register themselves.
2.  **Initial Credentials:** Upon registration, the HR member provides the new employee with their initial credentials (email and a temporary password).
3.  **First Login:** The employee uses these credentials for their first login.
4.  **Forced Password Change:** For security purposes, the system will immediately detect that this is the user's first login and will prompt them to change their password.
5.  **Re-authentication:** After successfully setting a new, secure password, the user is redirected back to the login page.
6.  **Normal Access:** The employee can now log in with their new password to gain full access to the application based on their role.

#### Role-Based Permissions

The application enforces a strict role-based access control (RBAC) model to ensure data security and integrity.

- **Employee:** Can view the directory and update their own non-critical personal information, such as their phone number and name, work location.
- **Manager:** Has all the permissions of an Employee. Additionally, they can view their direct reports' full profiles (including salary) and update critical data for their team members, such as their job title, role, salary, and assigned manager.
- **HR (Human Resources):** Possesses the highest level of access. They can perform all actions of a Manager but for any employee in the organization. They are also the only role authorized to register new employees.

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

#### 2. Node.js Package Installation

Navigate to the server directory and install its dependencies.

a.  **Navigate to the server directory:**

    ```bash
    cd server
    ```

b.  **Install all required npm packages:**

    ```bash
    npm install
    ```

c.  **Run the development server:**

    ```bash
    npm run start:dev
    ```

The API server will be available at `http://localhost:4000`.

#### 3. Python Machine Learning Environment Setup

a.  **Navigate to the python directory from the project root:**

    ```bash
    cd python
    mkdir -p path/to
    cd path/to
    ```

b.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
c.  **Activate the virtual environment:**
    - On Windows (Git Bash):
      ```bash
      source venv/Scripts/activate
      ```
    - On macOS/Linux:
      ```bash
      source venv/bin/activate
      ```
d.  **Install required Python packages:**
    ```bash
    pip install pandas scikit-learn
    ```
e.  **Windows Specific Path Update:**
    If you are running the application on Windows, you must update the Python script path in the controller.
    - **File:** `server/src/app/modules/predictSalary/predictSalary.controller.ts`
    - **Change:** On line 18, replace `bin` with `Scripts`.

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

## Test Credentials

Use the following credentials to test different user roles and permissions.

| Email                     | Password       | Role       | Notes               |
| :------------------------ | :------------- | :--------- | :------------------ |
| `daniel.robinson@abc.com` | `Robinson2024` | `manager`  | Manager of managers |
| `priya.sharma@abc.com`    | `Sharma2024`   | `hr`       |                     |
| `lena.martinez@abc.com`   | `Martinez2024` | `manager`  |                     |
| `tom.holland@abc.com`     | `Holland2025`  | `employee` |                     |
| `aisha.siddiqa@abc.com`   | `Siddiqa2024`  | `employee` |                     |
