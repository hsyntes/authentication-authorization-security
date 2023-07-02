# Authentication & Authorization & Security

This README provides an overview of the authentication, authorization, and security considerations for a back-end application written with Node.js, Express.js, mongoDB and mongoose. These components are widely used in building web applications and require careful attention to ensure the safety and integrity of user data.

## Features

- Security HTTP headers with **helmet**
- Rate limitting from the same **IP/API**
- Data Sanitization against **NoSQL** injection
- Data Sanitization against **XSS**
- Maganing & catching errors globally with **middleware** functions
- Sending token to users' email address to reset & update their password more secure
- Generate expired token
- Verifying **JSON Web Token**
- **Encrypting** & **hashing** passwords
- Restrict/protect some features by token
- Email validator
- Dedicate environments to **development** and **production**
- Structured users'data more secure with **mongoose Data Modelling**

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
  DELETE /api/v1/users/close/
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `close/`  | `string` | **Required** verifying token |

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
