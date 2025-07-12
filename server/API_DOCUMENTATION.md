# Enterprise Directory API Documentation

## 1. Overview

This API serves an enterprise-wide employee directory. It provides endpoints for user authentication, employee data management, and profile interactions. The API is built with Node.js, Express, and TypeScript, using MongoDB as the database.

It employs a robust security model with role-based access control (RBAC) to ensure that sensitive data, such as salaries, is only accessible to authorized personnel.

## 2. Authentication & Authorization

The security of this API is handled through a combination of JSON Web Tokens (JWT) and a role-based system.

### How Authentication Works

1. **Login**: A user sends their credentials (`email` and `password`) to the `POST /api/auth/login` endpoint.
2. **Token Issuance**: If the credentials are valid, the server generates two JWTs:
   - `accessToken`: A short-lived token containing the user's ID and role (`id`, `role`).
   - `refreshToken`: A long-lived token used to get a new `accessToken`.
3. **Cookie Storage**: These tokens are sent back to the client and stored in secure, `httpOnly` cookies named `accessToken` and `refreshToken`. This is a crucial security measure to prevent XSS attacks from stealing the tokens.
4. **Authenticated Requests**: For all subsequent requests to protected endpoints, the browser automatically sends the `accessToken` cookie. The server's `auth` middleware intercepts this token to identify and verify the user.

### How Authorization (Role-Based Access Control) Works

- The `auth` middleware is the gatekeeper for all protected routes.
- When defining a route, you specify which roles are allowed to access it (e.g., `auth(UserRole.hr, UserRole.manager)`).
- The middleware decodes the `accessToken` to get the user's role.
- If the user's role is in the list of required roles for that endpoint, access is granted. Otherwise, a `401 Unauthorized` error is returned.
- The API defines three roles: `hr`, `manager`, and `employee`.

## 3. API Endpoints

All endpoints are prefixed with `/api`.

### Module: `Auth`

Base Path: `/api/auth`

---

#### Register a New User

- **Endpoint**: `POST /register`
- **Description**: Creates a new employee record in the database. This is typically used for onboarding new hires.
- **Authorization**: Only accessible to users with the **`hr`** or **`manager`** role.
- **Request (from Frontend)**:
  - **Type**: `JSON`
  - **Body**: An object containing the new user's details.

```json
{
  "name": {
    "firstName": "Daniel",
    "lastName": "Nguyen"
  },
  "email": "daniel.nguyen@abc.com",
  "phoneNo": "9876543210",
  "role": "employee",
  "password": "Nguyen2024",
  "workLocation": {
    "city": "Denver",
    "state": "CO",
    "country": "USA"
  },
  "salary": 85000,
  "jobTitle": "Frontend Engineer",
  "managerId": "manager_id" // Here manager id is the _id from user-details collection
}
```

- **Response (to Frontend)**:
  - **Status**: `201 Created`
  - **Body**: The newly created user object (typically without the password).

  ```json
  {
    "success": true,
    "message": "User has been registered successfully",
    "data": {
      "userId": "68715d2912a928dcecce322f",
      "name": {
        "firstName": "Daniel",
        "lastName": "Nguyen",
        "_id": "68715d2912a928dcecce3232"
      },
      "phoneNo": "9876543210",
      "workLocation": {
        "city": "Denver",
        "state": "CO",
        "country": "USA",
        "_id": "68715d2912a928dcecce3233"
      },
      "salary": 85000,
      "jobTitle": "Frontend Engineer",
      "managerId": "68708dcc6b89035b5ce19618",
      "_id": "68715d2912a928dcecce3231",
      "createdAt": "2025-07-11T18:51:21.991Z",
      "updatedAt": "2025-07-11T18:51:21.991Z",
      "__v": 0,
      "fullName": "Daniel Nguyen",
      "id": "68715d2912a928dcecce3231"
    }
  }
  ```

---

#### Login a User

- **Endpoint**: `POST /login`
- **Description**: Authenticates a user and sets the `accessToken` and `refreshToken` cookies.
- **Authorization**: Public (no authentication required).
- **Request**:
  - **Type**: `JSON`
  - **Body**:

    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Cookies**: Sets `accessToken` and `refreshToken`.
  - **Body**:

    ```json
    {
      "success": true,
      "message": "User is logged in successfully",
      "data": {
        "needsPasswordChange": true // true - after the user changes their password, this field will be updated false
      }
    }
    ```

---

#### Logout a User

- **Endpoint**: `POST /logout`
- **Description**: Clears the authentication cookies, effectively logging the user out.
- **Authorization**: `hr`, `manager`, `employee` (any logged-in user).
- **Request**: Empty body.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: A success message.

---

#### Change Password

- **Endpoint**: `POST /change-password`
- **Description**: Allows a logged-in user to change their password.
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**:
  - **Type**: `JSON`
  - **Body**:

    ```json
    {
      "oldPassword": "current_password",
      "newPassword": "new_strong_password"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**: A success message.

---

#### Refresh Access Token

- **Endpoint**: `POST /refresh-token`
- **Description**: Uses the `refreshToken` (sent via cookie) to generate a new `accessToken`. This is typically called by the frontend when an API request fails with a 401 error.
- **Authorization**: Public (relies on the `refreshToken` cookie).
- **Request**: Empty body.
- **Response**:
  - **Status**: `200 OK`
  - **Cookies**: Sets a new `accessToken`.
  - **Body**: A success message.

---

### Module: `UserDetails`

Base Path: `/api/user-details`

---

#### Get My Profile

- **Endpoint**: `GET /me`
- **Description**: Retrieves the complete profile information for the currently logged-in user.
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**: None.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: The full user object for the logged-in user.

  ```json
  {
    "success": true,
    "message": "User data retrieved successfully",
    "data": {
      "_id": "68709016119556a991a34016",
      "email": "lena.martinez@abc.com",
      "role": "manager",
      "createdAt": "2025-07-11T04:16:22.972Z",
      "updatedAt": "2025-07-11T04:16:22.972Z",
      "__v": 0,
      "userDetails": {
        "_id": "68709017119556a991a34018",
        "userId": "68709016119556a991a34016",
        "name": {
          "firstName": "Lena",
          "lastName": "Martinez",
          "_id": "68709017119556a991a34019"
        },
        "phoneNo": "5103849275",
        "workLocation": {
          "city": "Austin",
          "state": "TX",
          "country": "USA",
          "_id": "68709017119556a991a3401a"
        },
        "salary": 85000,
        "jobTitle": "Engineering Team Lead",
        "managerId": "68708dcc6b89035b5ce19618",
        "createdAt": "2025-07-11T04:16:23.325Z",
        "updatedAt": "2025-07-11T04:16:23.325Z",
        "__v": 0
      }
    }
  }
  ```

---

#### Update My Profile

- **Endpoint**: `PATCH /update-me`
- **Description**: Allows a user to update their own non-critical information (like phone number).
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**:
  - **Type**: `JSON`
  - **Body**: An object with the fields to update.

    ```json
    {
      "name": {
        "firstName": "Changed firstName",
        "lastName": "Changed lastName"
      },
      "phone": "9876543210",
      "workLocation": {
        "city": "changed city",
        "state": "changed state",
        "country": "changed country"
      }
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**: The updated user object.

  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "_id": "6870974c65ce28a7a6e2a129",
      "userId": "6870974c65ce28a7a6e2a127",
      "name": {
        "firstName": "Aisha",
        "lastName": "Siddiqa",
        "_id": "6870b3b46a989fce5b0b3b06"
      },
      "phoneNo": "1234567890",
      "workLocation": {
        "city": "Denver",
        "state": "CO",
        "country": "USA",
        "_id": "6870974c65ce28a7a6e2a12b"
      },
      "salary": 82000,
      "jobTitle": "Backend Developer",
      "managerId": "68708dcc6b89035b5ce19618",
      "createdAt": "2025-07-11T04:47:08.621Z",
      "updatedAt": "2025-07-11T06:48:20.780Z",
      "__v": 0,
      "fullName": "Aisha Siddiqa",
      "id": "6870974c65ce28a7a6e2a129"
    }
  }
  ```

---

#### Get All Employees

- **Endpoint**: `GET /employees`
- **Description**: Retrieves a list of all employees. **Crucially, the salary field is conditionally included based on the requester's role**, as handled by the backend logic.
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**: None.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: An array of employee objects.
    - **For HR**: All employees with salaries.
    - **For Managers**: Their direct reports with salaries, themselves with salary, and everyone else without salary.
    - **For Employees**: Themselves with salary, and everyone else without salary.

    ```json
    {
      "success": true,
      "message": "All employees data retrieved successfully",
      "data": [
        {
          "_id": "68708dcc6b89035b5ce19618",
          "userId": {
            "_id": "68708dcc6b89035b5ce19616",
            "email": "daniel.robinson@abc.com",
            "role": "manager"
          },
          "name": {
            "firstName": "Daniel",
            "lastName": "Robinson",
            "_id": "68708dcc6b89035b5ce19619"
          },
          "phoneNo": "3478925412",
          "workLocation": {
            "city": "Seattle",
            "state": "WA",
            "country": "USA",
            "_id": "68708dcc6b89035b5ce1961a"
          },
          "salary": 85000,
          "jobTitle": "Technical Program Manager",
          "managerId": null,
          "createdAt": "2025-07-11T04:06:36.776Z",
          "updatedAt": "2025-07-11T04:06:36.776Z",
          "__v": 0
        },
        {
          "_id": "68708f4001346a0c64ae985d",
          "userId": {
            "_id": "68708f4001346a0c64ae985b",
            "email": "priya.sharma@abc.com",
            "role": "hr"
          },
          "name": {
            "firstName": "Priya",
            "lastName": "Sharma",
            "_id": "68708f4001346a0c64ae985e"
          },
          "phoneNo": "6467281934",
          "workLocation": {
            "city": "Chicago",
            "state": "IL",
            "country": "USA",
            "_id": "68708f4001346a0c64ae985f"
          },
          "salary": 0,
          "jobTitle": "HR Business Partner",
          "managerId": "68708dcc6b89035b5ce19618",
          "createdAt": "2025-07-11T04:12:48.456Z",
          "updatedAt": "2025-07-11T04:12:48.456Z",
          "__v": 0
        }
      ]
    }
    ```

---

#### Search for Employees

- **Endpoint**: `POST /employees/search`
- **Description**: Searches for employees based on filter criteria (city, email, phone no., firstName, lastName, role, job title). The same salary visibility rules as `GET /employees` apply.
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**:
  - **Type**: `JSON`
  - **Body**:

    ```json
    {
      "firstName": "Jane",
      "role": "hr"
    }
    ```

    or

    ```json
    {
      "jobTitle": "Frontend Engineer",
      "email": "emily@abc.com"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**: An array of employee objects matching the search.

  ```json
  {
    "success": true,
    "message": "Employee data retrieved successfully",
    "data": [
      {
        "_id": "68708f4001346a0c64ae985b",
        "email": "priya.sharma@abc.com",
        "role": "hr",
        "userDetails": {
          "name": {
            "firstName": "Priya",
            "lastName": "Sharma",
            "_id": "68708f4001346a0c64ae985e"
          },
          "phoneNo": "6467281934",
          "workLocation": {
            "city": "Chicago",
            "state": "IL",
            "country": "USA",
            "_id": "68708f4001346a0c64ae985f"
          },
          "salary": null,
          "jobTitle": "HR Business Partner",
          "managerId": "68708dcc6b89035b5ce19618"
        }
      }
    ]
  }
  ```

---

#### Get a Single Employee's Details

- **Endpoint**: `GET /employees/:userId`
- **Description**: Retrieves the profile of a specific employee by their ID. Salary visibility rules apply.
- **Authorization**: `hr`, `manager`, `employee`.
- **Request**:
  - **URL Parameter**: `userId` (the MongoDB ObjectId of the employee - set it as string).
- **Response**:
  - **Status**: `200 OK`
  - **Body**: A single employee object.

    ```json
    {
      "success": true,
      "message": "Employee datails retrieved successfully",
      "data": {
        "_id": "6870974c65ce28a7a6e2a129",
        "userId": {
          "_id": "6870974c65ce28a7a6e2a127",
          "email": "aisha.siddiqa@abc.com",
          "role": "employee"
        },
        "name": {
          "firstName": "Aisha",
          "lastName": "Siddiqa",
          "_id": "6870b3b46a989fce5b0b3b06"
        },
        "phoneNo": "1234567890",
        "workLocation": {
          "city": "Denver",
          "state": "CO",
          "country": "USA",
          "_id": "6870974c65ce28a7a6e2a12b"
        },
        "salary": 82000,
        "jobTitle": "Backend Developer",
        "managerId": "68708dcc6b89035b5ce19618",
        "createdAt": "2025-07-11T04:47:08.621Z",
        "updatedAt": "2025-07-11T06:48:20.780Z",
        "__v": 0
      }
    }
    ```

---

#### Update an Employee (HR, MANAGER)

- **Endpoint**: `PATCH /employee/:userId`
- **Description**: Updates critical information for a specific employee, such as their role, salary, or job title, managerId.
- **Authorization**: `hr`, `manager`.
- **Request**:
  - **URL Parameter**: `userId`.
  - **Type**: `JSON`
  - **Body**:

    ```json
    {
      "salary": 95000,
      "jobTitle": "Senior Software Engineer"
    }
    ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**: The updated employee object.

  ```json
  {
    "success": true,
    "message": "Employee data updated successfully",
    "data": {
      "_id": "6870c7a336bdec1fa7752464",
      "userId": "6870c7a236bdec1fa7752462",
      "name": {
        "firstName": "Emily",
        "lastName": "Chen",
        "_id": "6870c7a336bdec1fa7752465"
      },
      "phoneNo": "6467891234",
      "workLocation": {
        "city": "Austin",
        "state": "TX",
        "country": "USA",
        "_id": "6870c7a336bdec1fa7752466"
      },
      "salary": 82000,
      "jobTitle": "UI/UX designer",
      "managerId": "68709017119556a991a34018",
      "createdAt": "2025-07-11T08:13:23.237Z",
      "updatedAt": "2025-07-11T19:14:58.136Z",
      "__v": 0,
      "fullName": "Emily Chen",
      "id": "6870c7a336bdec1fa7752464"
    }
  }
  ```

---

#### Delete an Employee (HR, MANAGER)

- **Endpoint**: `DELETE /employees/:userId`
- **Description**: Deletes an employee's record from the database.
- **Authorization**: `hr`, `manager`.
- **Request**:
  - **URL Parameter**: `userId`.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: A success message.

  ```json
  {
    "success": true,
    "message": "Employee deleted successfully",
    "data": {
      "_id": "687112e773190b75df191e02",
      "userId": "687112e673190b75df191e00",
      "name": {
        "firstName": "Daniel",
        "lastName": "Nguyen",
        "_id": "687112e773190b75df191e03"
      },
      "phoneNo": "9876543210",
      "workLocation": {
        "city": "Denver",
        "state": "CO",
        "country": "USA",
        "_id": "687112e773190b75df191e04"
      },
      "salary": 85000,
      "jobTitle": "Frontend Engineer",
      "managerId": "68708dcc6b89035b5ce19618",
      "createdAt": "2025-07-11T13:34:31.011Z",
      "updatedAt": "2025-07-11T13:34:31.011Z",
      "__v": 0,
      "fullName": "Daniel Nguyen",
      "id": "687112e773190b75df191e02"
    }
  }
  ```

---

#### Get All Managers

- **Endpoint**: `GET /managers`
- **Description**: Retrieves a list of all employees with the 'manager' role. This is useful for populating dropdowns in the frontend when assigning amanager to a new employee.
- **Authorization**: `hr`, `manager`.
- **Request**: None.
- **Response**:
- **Status**: `200 OK`
- **Body**: An array of user objects who have the 'manager' role.

```json
{
  "success": true,
  "message": "Managers data retrieved successfully",
  "data": [
    {
      "_id": "68708dcc6b89035b5ce19616",
      "email": "daniel.robinson@abc.com",
      "role": "manager",
      "userDetails": {
        "_id": "68708dcc6b89035b5ce19618",
        "userId": "68708dcc6b89035b5ce19616",
        "name": {
          "firstName": "Daniel",
          "lastName": "Robinson",
          "_id": "68708dcc6b89035b5ce19619"
        },
        "phoneNo": "3478925412",
        "workLocation": {
          "city": "Seattle",
          "state": "WA",
          "country": "USA",
          "_id": "68708dcc6b89035b5ce1961a"
        },
        "jobTitle": "Technical Program Manager",
        "managerId": null,
        "createdAt": "2025-07-11T04:06:36.776Z",
        "updatedAt": "2025-07-11T04:06:36.776Z",
        "__v": 0
      }
    },
    {
      "_id": "68709016119556a991a34016",
      "email": "lena.martinez@abc.com",
      "role": "manager",
      "userDetails": {
        "_id": "68709017119556a991a34018",
        "userId": "68709016119556a991a34016",
        "name": {
          "firstName": "Lena",
          "lastName": "Martinez",
          "_id": "68709017119556a991a34019"
        },
        "phoneNo": "5103849275",
        "workLocation": {
          "city": "Austin",
          "state": "TX",
          "country": "USA",
          "_id": "68709017119556a991a3401a"
        },
        "jobTitle": "Engineering Team Lead",
        "managerId": "68708dcc6b89035b5ce19618",
        "createdAt": "2025-07-11T04:16:23.325Z",
        "updatedAt": "2025-07-11T04:16:23.325Z",
        "__v": 0
      }
    }
  ]
}
```

---

#### Get All HRs

- **Endpoint**: `GET /hrs`
- **Description**: Retrieves a list of all employees with the 'hr' role.
- **Authorization**: `hr`, `manager`.
- **Request**: None.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: An array of user objects who have the 'hr' role.

```json
{
  "success": true,
  "message": "HRs data retrieved successfully",
  "data": [
    {
      "_id": "68708f4001346a0c64ae985b",
      "email": "priya.sharma@abc.com",
      "role": "hr",
      "userDetails": {
        "_id": "68708f4001346a0c64ae985d",
        "userId": "68708f4001346a0c64ae985b",
        "name": {
          "firstName": "Priya",
          "lastName": "Sharma",
          "_id": "68708f4001346a0c64ae985e"
        },
        "phoneNo": "6467281934",
        "workLocation": {
          "city": "Chicago",
          "state": "IL",
          "country": "USA",
          "_id": "68708f4001346a0c64ae985f"
        },
        "jobTitle": "HR Business Partner",
        "managerId": "68708dcc6b89035b5ce19618",
        "createdAt": "2025-07-11T04:12:48.456Z",
        "updatedAt": "2025-07-11T04:12:48.456Z",
        "__v": 0
      }
    }
  ]
}
```

## Module: Prediction

This module provides endpoints for interacting with the trained machine learning model.

**Base Path:** `/api/predict`

---

### 🔮 Predict Employee Salary

- **Endpoint:** `POST /salary`
- **Description:**
  Predicts an estimated salary by sending job details to the trained Linear Regression model.
  This endpoint is ideal for _"what-if"_ scenarios, like estimating a salary for a new role or different location.
- **Authorization:**
  Accessible to any logged-in user (`hr`, `manager`, `employee`).
- **Request**:
  - **Type:** JSON
  - **Body:** An object containing the features required by the model.

  ```json
  {
    "role": "employee",
    "jobTitle": "Software Engineer",
    "location": "New York"
  }
  ```

- **Response**:
  - **Status**: `200 OK`
  - **Body**: A JSON object containing the predicted salary.

  ```json
  {
    "success": true,
    "message": "Salary predicted successfully",
    "data": {
      "predicted_salary": 70531.88
    }
  }
  ```
