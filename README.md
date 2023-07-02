# Authentication & Authorization & Security

An overview of the authentication, authorization and security considerations for a back-end application written with Node.js, Express.js mongoDB and mongoose. These components are widely used in building web applications and require careful attention to ensure the safety and integrity of user data.

## Features

- Security HTTP headers with **helmet**
- Rate limitting from the same **IP/API**
- Data Sanitization against **NoSQL** injection
- Data Sanitization against **XSS**
- Maganing & catching errors globally with **middleware** functions
- Sending token to users' email address to reset & update their password more secure
- Generate expired token
- Verifying **JSON Web Token**
- Sending JWT via **cokie**
- **Encrypting** & **hashing** passwords
- Restrict/protect some features by token
- Email validator
- Dedicate environments to **development** and **production**
- Structured users'data more secure with **mongoose Data Modelling**

## Authentication

Authentication is the process of verifying the identity of a user or system. In the context of a back-end application, it ensures that only authorized users can access protected resources. Here are some key considerations for implementing authentication:

## User Registration

Implement a user registration process that collects necessary information, such as username, email, and password. Ensure that password requirements, such as length and complexity, are enforced.

## Login

Provide a secure login mechanism using sessions or tokens. Validate user credentials against stored data and generate authentication tokens or session cookies for subsequent requests.

## Password Reset

Offer a secure password reset functionality that involves verifying the user's identity through a password reset email or other verification methods.

## Authentication Middleware

Use middleware to authenticate requests. This middleware should check for valid authentication tokens, verify session cookies, or implement other authentication mechanisms.

## Authorization

Authorization determines what actions a user can perform within an application. It ensures that authenticated users have the necessary permissions to access or modify specific resources. Consider the following when implementing authorization

## Role-Based Access Control

Implement role-based access control (RBAC) to assign different permissions to different user roles. For example, an administrator role might have more privileges than a regular user role.

## Resource-Based Authorization

Control access to specific resources based on user roles and ownership. Ensure that users can only access resources they are authorized to view or modify.

## Security

Maintaining the security of your application is crucial to protect user data and prevent unauthorized access or data breaches. Consider the following security measures

#### Input Validation

Validate and sanitize all user input to prevent common security vulnerabilities such as SQL injection, cross-site scripting (XSS), and command injection attacks. Use libraries or built-in mechanisms to handle input validation and sanitize user input before using it in database queries or rendering it in HTML templates.

#### Password Hashing

Store user passwords securely by hashing them with a strong cryptographic algorithm like bcrypt or Argon2. Hashing passwords prevents storing plain-text passwords in the database, making it harder for attackers to retrieve user passwords in case of a data breach.

#### Secure Communication

Enable secure communication between clients and the server using HTTPS/TLS. This ensures that data transmitted over the network is encrypted and protects against eavesdropping and tampering. Obtain and install an SSL certificate to enable HTTPS on your server.

#### Session Management

Implement secure session management to track user sessions and prevent session-related attacks such as session hijacking or fixation. Use secure session storage mechanisms, such as server-side storage or encrypted client-side storage (e.g., signed cookies), and regenerate session IDs after user authentication or privilege changes.

### Error Handling

Handle errors securely to avoid information leakage and potential vulnerabilities. Follow these best practices for error handling

#### Avoid Detailed Error Messages

Do not expose sensitive information or detailed error messages to clients in production environments. Instead, log the error details on the server and provide user-friendly error messages to clients.

#### Custom Error Handling Middleware

Implement custom error handling middleware to catch and handle errors in a consistent and secure manner. This middleware can log errors, handle different error types, and send appropriate error responses to clients.
Error Reporting and Monitoring: Set up error reporting and monitoring tools to track and investigate errors occurring in your application. These tools can help you identify and address security vulnerabilities or other issues promptly.

## API Reference

#### Get all users

```http
  GET /api/v1/users/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `/`       | `string` | -           |

#### Get a user

```http
  GET /api/v1/users/username/
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `username/` | `string` | **Required** Verifying token |

#### SignUp

```http
  POST /api/v1/users/signup/
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `signup/` | `string` | **Required** all fields in Model |

#### Login

```http
  POST /api/v1/users/login/
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `login/`  | `string` | **Required** email or username and password |

#### Forgot Password

```http
  POST /api/v1/users/forgot-password/
```

| Parameter          | Type     | Description        |
| :----------------- | :------- | :----------------- |
| `forgot-password/` | `string` | **Required** email |

#### Reset Password

```http
  PATCH /api/v1/users/reset-password/passwordResetToken
```

| Parameter                            | Type     | Description                   |
| :----------------------------------- | :------- | :---------------------------- |
| `reset-password/passwordResetToken/` | `string` | **Required** token from email |

#### Update Password

```http
  PATCH /api/v1/users/update-password/
```

| Parameter          | Type     | Description                  |
| :----------------- | :------- | :--------------------------- |
| `update-password/` | `string` | **Required** verifying token |

#### Deactivate User

```http
  DELETE /api/v1/users/deactivate/
```

| Parameter     | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `deactivate/` | `string` | **Required** verifying token |

#### Close Account

```http
  DELETE /api/v1/users/delete/
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `close/`  | `string` | **Required** verifying token |

#### Update

```http
  PATCH /api/v1/users/delete/
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `update/` | `string` | **Required** verifying token |

## Run Locally

Clone the project

```bash
  git clone https://github.com/hsyntes/authentication-authorization-security
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server on develeopment environment

```bash
  npm start
```

Start the server on **production** environment

```bash
  npm run start:prod
```

## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
