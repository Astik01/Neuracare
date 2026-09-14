# Neuracare — MERN Healthcare App

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)

A healthcare application with an AI-style symptom checker, doctor search and booking, and JWT-based
user accounts. Built as a MERN stack app: React (Vite) + Tailwind CSS on the frontend, Express +
MongoDB on the backend, with a Jest test suite (Supertest on the backend, React Testing Library on
the frontend) covering both.

**Tech stack:** React, Vite, Tailwind CSS, React Router · Node.js, Express, MongoDB/Mongoose · JWT +
bcrypt auth · Jest, React Testing Library, Supertest.

This is a rebuild of an earlier vanilla HTML/CSS/JS prototype; the whole app now lives in `backend/`
and `client/` below.

## Project structure

```
backend/
├── src/
│   ├── app.js              # Express app (routes + middleware), no app.listen — importable by tests
│   ├── server.js           # process entrypoint
│   ├── config/db.js
│   ├── models/             # User, Contact, Doctor, Booking
│   ├── routes/             # auth, users, contacts, doctors, bookings, symptom-check
│   ├── middleware/         # requireAuth (JWT), errorHandler
│   ├── services/           # symptomAnalysis
│   └── seed/                # sample doctor data + npm run seed
└── tests/
    ├── auth/ users/ api/ errors/ generators/ db/

client/
├── src/
│   ├── api/client.js        # fetch wrapper (attaches JWT, normalizes errors)
│   ├── context/AuthContext.jsx
│   ├── components/          # Layout, ProtectedRoute, ChatWidget
│   ├── hooks/useDarkMode.js
│   ├── data/                # articles.js, faqs.js
│   └── pages/                # one folder per route, tests colocated
```

## Quick start

```bash
npm install                 # installs backend/ and client/ via npm workspaces
cp backend/.env.example backend/.env   # then set MONGODB_URI (MongoDB Atlas) / JWT_SECRET
npm run dev:backend         # Express API on http://localhost:5000
npm run dev:client          # Vite dev server on http://localhost:5173
npm run seed --workspace backend   # optional: seed sample doctors
```

## Tests

```bash
npm run test:backend        # Jest + Supertest, mongodb-memory-server (no real DB needed)
npm run test:client         # Jest + React Testing Library
```

Both suites also run in CI on every push/PR via `.github/workflows/ci.yml`.

## Features

- **Auth** — signup/login backed by bcrypt password hashing and JWT (`/api/auth`), with a
  `requireAuth` middleware protecting `/api/users/me`, `/api/bookings`, and profile/booking pages.
- **Symptom Checker** — `/api/symptom-check` scores a set of symptoms against a small condition
  database and returns the top matches with an urgency level. This is a demo heuristic, not a
  medical diagnosis.
- **Find Doctors / Doctor Profile** — filterable doctor listing backed by a `Doctor` model, with
  booking directly from a doctor's profile.
- **My Bookings** — a signed-in user's own bookings, with cancellation, rescheduling, and an
  **Add to Calendar** (`.ics`) download from the booking confirmation screen.
- **Contact** — a simple message form backed by `/api/contacts`.
- **Health Library** — a few sample articles, and a searchable FAQ Help Centre.
- **Dark mode** and a **floating chat widget** with canned, keyword-based replies.
- **Accessibility** — semantic HTML, full keyboard navigation (including Escape-to-close on modals,
  dropdowns, and the chat panel), meaningful alt text on doctor/article images, and text/button
  contrast spot-checked against WCAG AA in both light and dark mode.

## Environment variables

`backend/.env` (see `backend/.env.example`):

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/neuracare?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=<a real random secret>
JWT_EXPIRES_IN=1h
FRONTEND_URL=<deployed frontend origin, e.g. https://your-app.vercel.app>
```

`client/.env` (see `client/.env.example`):

```
VITE_API_URL=<deployed backend URL + /api, e.g. https://your-backend.onrender.com/api>
```

The backend connects to a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster via `MONGODB_URI`.
Get the connection string from the Atlas dashboard (Database → Connect → Drivers), swap in your
database user's credentials, and put it in `backend/.env` — never commit it. Tests never touch
Atlas: they spin up an in-memory MongoDB via `mongodb-memory-server` (`backend/tests/db/setup.js`).

`FRONTEND_URL` and `VITE_API_URL` are only needed for a deployed setup (the backend's CORS is
restricted to `http://localhost:5173` plus whatever `FRONTEND_URL` is set to, and the client falls
back to `http://localhost:5000/api` when `VITE_API_URL` is unset) — neither is required for local dev.

## Known limitations

- The About page's team photos are placeholder stock images, not real staff (labeled as such in the UI).
- There's no real video-consultation backend — "Video call" is just a booking option, not a working call.
- The "email me about my appointments" preference is saved to the account but doesn't actually send
  email in this demo (also labeled as such in the UI).

## Security note

This is a demo/portfolio application. Passwords are hashed and auth is real, but there's no rate
limiting, email verification, or password-reset flow, and the symptom checker is a heuristic, not a
clinical tool. Don't use it for real medical decisions.
