# HR Consultancy App

This project now includes a full authentication and booking flow with separate customer and admin access on top of the React + Vite frontend and Express + MongoDB backend.

## Features

- Public portfolio pages with no login required for browsing.
- Customer registration and login only when a visitor starts the booking flow.
- Protected booking page with date, time, and notes submission.
- Admin login and protected dashboard for viewing and managing all bookings.
- JWT-based authentication with MongoDB-backed users and bookings.

## Environment Setup

Copy `.env.example` to `.env` and set these values before production:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY` if you want booking notification emails

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are missing, the server creates a fallback local admin account for development only.

## Run

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run server
```

## Main Routes

- `/` public website
- `/customer-auth` customer login and registration
- `/book` protected customer booking page
- `/admin/auth` admin authentication (signup/login)
- `/admin` protected admin dashboard
