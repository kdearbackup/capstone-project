# 📘 API Endpoints – Enterprise Employee Directory

---

## 🔐 Authentication

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/api/auth/register` | Register a new user (HR/Admin only) |
| POST   | `/api/auth/login`    | Log in a user, return JWT/token     |

---

## 👤 User Profile

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/users/me`        | Get logged-in user’s profile |
| GET    | `/api/users/me/salary` | Get logged-in user’s salary  |

---

## 👥 Employee Management (HR/Admin only)

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/api/employees`     | Get all employees (with optional filters) |
| POST   | `/api/employees`     | Create a new employee                     |
| GET    | `/api/employees/:id` | Get specific employee details             |
| PUT    | `/api/employees/:id` | Update employee info (HR or self)         |
| DELETE | `/api/employees/:id` | Delete an employee (optional)             |

---

## 💵 Salary Access (with role-based rules)

| Method | Endpoint                    | Description                                           |
| ------ | --------------------------- | ----------------------------------------------------- |
| GET    | `/api/employees/:id/salary` | View salary of another employee (with access control) |

> **Access Rules:**
>
> - Regular users can view **their own** salary
> - Managers can view salaries of **their direct reports**
> - HR can view **anyone's** salary

---

## 📈 Reporting & Hierarchy

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| GET    | `/api/employees/:id/manager` | Get the manager of a specific employee |

---

## 🔍 Search / Utilities

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/employees/search?q=<query>` | Search employees by name, role, etc. |
