# Event Booking System

A full-stack web application for browsing and booking events, with admin management and PayPal payment integration.

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Nodemailer, Stripe  
**Frontend:** React 19, React Router, Bootstrap 5, Axios, Stripe (React)

## Project Structure

```
EventBooking/
├── backend/
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # JWT auth & role checks
│   ├── models/             # Mongoose schemas (User, Event, Booking)
│   ├── routes/             # API route definitions
│   ├── utils/              # Email utility
│   └── server.js           # Express app entry point
└── frontend-app/
    └── src/
        ├── pages/          # React page components
        ├── App.js          # Routes and auth guards
        └── axiosConfig.js  # Axios base config
```

## Features

- **User authentication** — Register/login with JWT tokens (1h expiry), passwords hashed with bcryptjs
- **Role-based access** — `admin` and `consumer` roles; admin-only routes protected by middleware
- **Event management** — Admins can create, update, and delete events; all users can browse
- **Ticket booking** — Users can book tickets; available count tracked on the Event model
- **PayPal payments** — Sandbox PayPal integration (create order + capture order flow)
- **Booking history** — Users view their own bookings; admins view all bookings

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/events` | — | List all events |
| GET | `/api/events/:id` | — | Get a single event |
| POST | `/api/events` | Admin | Create an event |
| PUT | `/api/events/:id` | Admin | Update an event |
| DELETE | `/api/events/:id` | Admin | Delete an event |
| POST | `/api/bookings` | User | Book an event |
| GET | `/api/bookings/my` | User | Get current user's bookings |
| GET | `/api/bookings/admin` | User | Get all bookings (admin use) |
| POST | `/api/paypal/create-order` | — | Create a PayPal order |
| POST | `/api/paypal/capture-order/:orderID` | — | Capture a PayPal payment |

## Frontend Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/home` | Event listing | Authenticated |
| `/book/:eventId` | Book a ticket | Authenticated |
| `/my-bookings` | User's bookings | Authenticated |
| `/admin` | Admin dashboard | Authenticated |
| `/admin/bookings` | All bookings | Authenticated |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- PayPal sandbox credentials

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/eventbooking
JWT_SECRET=your_jwt_secret
PORT=5000
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

Start the server:

```bash
npm run dev   # development (nodemon)
npm start     # production
```

### Frontend Setup

```bash
cd frontend-app
npm install
npm start
```

The app runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

## Data Models

**User** — `name`, `email`, `password` (hashed), `role` (`admin` | `consumer`)

**Event** — `title`, `description`, `date`, `location`, `price`, `ticketsAvailable`, `ticketsSold`, `createdBy` (User ref)

**Booking** — `event` (Event ref), `user` (User ref), `ticketsBooked`, `totalAmount`, `transactionId`, `payerEmail`, `paymentStatus` (`pending` | `paid` | `failed`)
