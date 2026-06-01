# EventBooking

A full-stack MERN (MongoDB, Express, React, Node.js) application for browsing and booking events with role-based access, JWT authentication, PayPal payments, and email notifications.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, React Router, Bootstrap 5, Stripe |
| Backend   | Node.js, Express 5, Mongoose        |
| Database  | MongoDB                             |
| Auth      | JWT (jsonwebtoken), bcryptjs        |
| Payments  | PayPal SDK (sandbox)                |
| Email     | Nodemailer (Gmail)                  |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A running [MongoDB](https://www.mongodb.com/) instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [PayPal Developer](https://developer.paypal.com/) account (for sandbox credentials)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled

---

## Project Structure

```
EventBooking/
├── backend/           # Express API server
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend-app/      # React client
│   └── src/
│       ├── pages/
│       ├── App.js
│       └── axiosConfig.js
└── package.json
```

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd EventBooking
```

### 2. Configure the backend environment

Create a `.env` file inside the `backend/` directory:

```bash
touch backend/.env
```

Add the following variables to `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventbooking
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password

PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
```

| Variable               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `PORT`                 | Port the backend server listens on (default: `5000`)                        |
| `MONGO_URI`            | MongoDB connection string                                                   |
| `JWT_SECRET`           | Secret key used to sign JWT tokens — use a long random string               |
| `EMAIL_USER`           | Gmail address used to send notification emails                              |
| `EMAIL_PASS`           | [Gmail App Password](https://support.google.com/accounts/answer/185833) (not your regular password) |
| `PAYPAL_CLIENT_ID`     | PayPal sandbox client ID from the developer dashboard                       |
| `PAYPAL_CLIENT_SECRET` | PayPal sandbox client secret                                                |

### 3. Install dependencies

Install backend and frontend dependencies separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend-app
npm install
```

### 4. Run the application

Open two terminal windows and run each service:

**Terminal 1 — Backend (with auto-reload):**

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000`.

**Terminal 2 — Frontend:**

```bash
cd frontend-app
npm start
```

The app will open at `http://localhost:3000`.

---

## API Overview

| Method | Endpoint                             | Description              | Auth Required |
|--------|--------------------------------------|--------------------------|---------------|
| POST   | `/api/auth/register`                 | Register a new user      | No            |
| POST   | `/api/auth/login`                    | Login and receive JWT    | No            |
| GET    | `/api/events`                        | List all events          | No            |
| POST   | `/api/events`                        | Create an event          | Admin         |
| PUT    | `/api/events/:id`                    | Update an event          | Admin         |
| DELETE | `/api/events/:id`                    | Delete an event          | Admin         |
| POST   | `/api/bookings`                      | Book an event            | User          |
| GET    | `/api/bookings/my`                   | View your bookings       | User          |
| GET    | `/api/bookings`                      | View all bookings        | Admin         |
| POST   | `/api/paypal/create-order`           | Create PayPal order      | User          |
| POST   | `/api/paypal/capture-order/:orderID` | Capture PayPal payment   | User          |

---

## User Roles

| Role       | Capabilities                                                              |
|------------|---------------------------------------------------------------------------|
| `consumer` | Browse events, book tickets, view own bookings                            |
| `admin`    | All consumer capabilities + create/edit/delete events, view all bookings |

To create an admin user, register normally and then update the `role` field in MongoDB directly:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Building for Production

```bash
# Build the React frontend
cd frontend-app
npm run build
```

The optimized build will be output to `frontend-app/build/`. Serve it with a static file server or configure Express to serve it from the backend.

---

## Troubleshooting

**MongoDB connection fails**
- Ensure MongoDB is running locally (`mongod`) or that your Atlas connection string is correct and the IP is whitelisted.

**JWT errors / 401 responses**
- Check that `JWT_SECRET` is set in `backend/.env`. Clearing `localStorage` in the browser and logging in again usually resolves stale token issues.

**Emails not sending**
- Confirm that [2-Step Verification](https://myaccount.google.com/security) is enabled on your Gmail account and that you are using an App Password, not your regular account password.

**PayPal errors**
- Ensure you are using sandbox credentials from [developer.paypal.com](https://developer.paypal.com/). Live credentials will not work in sandbox mode.
