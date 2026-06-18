# RoleX - Multi-Role Admin Dashboard

## Overview

RoleX is a full-stack Multi-Role Admin Dashboard built using Next.js, TypeScript, Node.js, Express.js, MongoDB Atlas, and JWT Authentication.

The system provides secure role-based access control (RBAC) where different users have different permissions based on their assigned role.

### Roles Supported

* Super Admin
* Manager
* Staff

Each role can access only the pages, actions, and data they are authorized to use.

---

## Features

### Authentication & Authorization

* Secure Login
* Secure Logout
* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Session Persistence
* Role-Based Access Control (RBAC)

### User Management (Super Admin Only)

* View Users
* Create Users
* Edit Users
* Delete Users
* Activate / Deactivate Users
* Assign Roles

### Order Management

* View Orders
* Order Details
* Search Orders
* Filter Orders
* Sort Orders
* Pagination

Role Permissions:

| Action        | Staff | Manager | Super Admin |
| ------------- | ----- | ------- | ----------- |
| View Orders   | ✅     | ✅       | ✅           |
| Edit Orders   | ❌     | ✅       | ✅           |
| Delete Orders | ❌     | ❌       | ✅           |

### Dashboard Analytics

* Total Users
* Total Orders
* Pending Orders
* Completed Orders
* Revenue Statistics
* Recent Orders

### Responsive Design

* Desktop Support
* Tablet Support
* Mobile Support
* Responsive Sidebar
* Mobile Drawer Navigation

### Loading & Error States

* Skeleton Loaders
* Empty States
* Error Handling
* Access Denied Pages
* Toast Notifications

### Security

* Backend Permission Validation
* Frontend Route Protection
* JWT Verification
* Role-Based Middleware
* Protected APIs
* Unauthorized Access Prevention

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs

### Database

* postgresql
  

---

## Folder Structure

```bash
rolex/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── utils/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Nandhini3Devaraj/rolex.git
cd rolex
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRE=7d
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Users

```http
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

### Orders

```http
GET /api/orders
GET /api/orders/:id
POST /api/orders
PUT /api/orders/:id
DELETE /api/orders/:id
```

---

## Role Permissions

### Super Admin

* Full Access
* Manage Users
* Manage Orders
* Manage Reports
* Manage Settings

### Manager

* View Dashboard
* View Reports
* View Orders
* Edit Orders

### Staff

* View Dashboard
* View Orders
* View Order Details

---

## Security Rules

The application validates permissions on both frontend and backend.

Examples:

* Staff users cannot delete orders.
* Managers cannot manage users.
* Only Super Admin can assign roles.
* Unauthorized API access returns HTTP 403 Forbidden.
* Unauthenticated requests return HTTP 401 Unauthorized.

---

## Future Enhancements

* Audit Logs
* Email Notifications
* Dark Mode
* Export Reports
* AI Analytics Dashboard
* Product Management Module

---

## Author

Nandhini Devaraj

GitHub:
https://github.com/Nandhini3Devaraj

Project:
https://github.com/Nandhini3Devaraj/rolex
