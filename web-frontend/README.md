# web-frontend

Next.js 16 (React 19, App Router) interface for Campus Resource Booking: search and live availability, booking confirmations for students, approvals and check-in/out for staff, and resource, user, and analytics management for admins.

## Run locally

Start the API first ([web-backend](../web-backend/README.md)), then:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:18321. To run everything in Docker instead, see the [root README](../README.md).

## How it connects to the API

- Browser requests go to `NEXT_PUBLIC_API_URL` (default `http://localhost:18320/api`) with `credentials: "include"`. The value is compiled in, so rebuild after changing it.
- Server Components use `INTERNAL_API_URL` when set (Docker uses `http://backend:18320/api`) and forward the user's cookie.
- The session token lives only in an `httpOnly` cookie; frontend code never reads or stores it.

## Booking confirmation and arrival

A confirmed booking appears under **My bookings → View details** with the student's name, university email, full booking ID, resource, location, date, and time. A pending request is not a confirmation; wait for staff approval first. The student shows the confirmation in their signed-in account at the resource. Staff compare those details with their own live booking record and use **Confirm check-in** in the staff view. There is no check-in code and the student cannot check themselves in. Staff can confirm from 15 minutes before the booking start until 15 minutes after it starts. A booking not checked in by that deadline is released; staff then record checkout for checked-in visits.

## Code layout

- `app/`: routes and layouts
- `features/`: UI and logic per area (auth, resources, bookings, dashboard, users, analytics)
- `components/`: shared UI
- `lib/`: API client and session helpers, pagination, realtime socket

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
