# Presentation kit

Material for a 5-minute presentation of Campus Resource Booking. The diagrams are written in [Mermaid](https://mermaid.js.org/) and render directly on GitHub and in VS Code with a Mermaid preview extension. For slides, screenshot them or paste the code into [mermaid.live](https://mermaid.live) and export PNG or SVG.

| File | Contents |
| --- | --- |
| [1-system-overview.md](1-system-overview.md) | Roles, use-case diagram, features by role, booking lifecycle, main flow |
| [2-architecture-and-api.md](2-architecture-and-api.md) | Architecture, request pipeline, data model, API tables, real-time events, performance |
| [3-screens.md](3-screens.md) | Screen map per role and wireframes of the main screens |

## 5-minute talk plan

The course asks for the app running live, not a video of it, so the talk is mostly a demo with a minute of slides. Keep one person driving and one narrating, and don't pass the laptop. The quotes are suggested wording; five minutes is about 700 spoken words.

| # | Time | On screen | Say and do |
| --- | --- | --- | --- |
| 1 | 0:00–0:30 | Landing page `/` | "Booking a room or lab at USTH means messages and spreadsheets. Two people book the same room and nobody finds out until both are standing in it. We built one system where students book, staff approve, and admins see the usage." |
| 2 | 0:30–1:30 | **Student** window: `/resources`, filter to laboratories, open *Demo Teaching Laboratory*. **Staff** window: the same lab on the same date. | Show the filters, then the grid: "it lists only the free hours, worked out from the opening hours, closures and existing bookings." Book an hour as the student. It goes to *pending*, because **approval is set per resource, not per person**. The hour disappears from the staff window without a refresh. |
| 3 | 1:30–2:15 | Staff: `/staff`, open the new request | Approve it. The student refreshes "My bookings" and sees *Confirmed*. With time to spare, reject the seeded pending request with a reason; the student sees that reason. |
| 4 | 2:15–3:00 | Student: today's *Demo Portable Projector* booking. Staff: the same booking from the operations list | The student generates the 6-digit check-in code. Staff enter it: *Checked in*. Then *Confirm check-out*: *Completed*. "Two-sided on purpose: neither side can fake attendance alone." |
| 5 | 3:00–3:30 | **Admin** window: `/admin/analytics`, then `/admin/resources` | Utilization, peak hours, most-booked resources. Resources, opening hours, closures and the approval rule are all set here. |
| 6 | 3:30–4:30 | Slides: the architecture diagram ([2](2-architecture-and-api.md#the-big-picture)), the "More than CRUD" table ([1](1-system-overview.md#what-makes-it-more-than-a-crud-app)) and the performance table ([2](2-architecture-and-api.md#performance-in-one-table)) | "Next.js, NestJS and PostgreSQL in Docker Compose. Every request passes rate limiting, a login check, a role check and input validation. Double booking is impossible, and not because of an `if`: a PostgreSQL exclusion constraint refuses overlapping bookings. We sent 100 bookings for the same slot at once, 20 times; exactly one won each time. One API process handles about 250 requests per second, with 0 errors up to 800 simultaneous users." |
| 7 | 4:30–5:00 | The green CI run, then the wrap-up | "Lint, type checks, unit tests, end-to-end tests against a real PostgreSQL, and a check that migrations roll back. Thank you. Questions?" |

Rules for the run-through:

- **Rehearse twice against a freshly rebuilt stack.** Stale containers have caused demo failures before.
- If a step fails, say its sentence, show the matching diagram or wireframe, and move to the next row. Don't debug on stage.
- Animations are a bonus. Don't spend any of the five minutes on them.

## Preparing the live demo

1. Rebuild and check that every service is healthy:
   ```bash
   docker compose up -d --build   # never present a stale build
   docker compose ps              # every service "healthy"
   ```
2. Optional: load the larger demo catalog (42 resources in 6 buildings) so search looks realistic:
   ```bash
   docker compose exec backend node dist/scripts/catalog-import.js
   ```
3. **Within the hour before the talk**, seed the demo data. The check-in booking it creates is for the current hour, so seeding earlier makes row 4 fail. Details, including the database settings it needs, are in [MVP_RELEASE.md §5](../MVP_RELEASE.md#5-demo-data).
   ```bash
   cd web-backend
   set -a; . ./.env; set +a
   DEMO_PASSWORD='choose-a-local-demo-password' npm run demo:seed
   ```
   It creates the `demo.student`, `demo.staff` and `demo.admin` accounts (all `@usth.edu.vn`, password from `DEMO_PASSWORD`), *Demo Teaching Laboratory* (needs approval), a pending request, and a confirmed *Demo Portable Projector* booking for the current hour. Rerunning it resets them, and `npm run demo:clean` removes them afterwards. You can use the `BOOTSTRAP_*` accounts from `.env` for staff and admin instead.
4. Sign in three sessions, **each in its own browser profile or private window**. The session is a single cookie per profile, so tabs of the same window would share one login. Put the student and staff windows side by side for row 2.
5. Screenshot every step. The brief wants the app running, so screenshots are only insurance. Other fallbacks: the wireframes in [3-screens.md](3-screens.md) and the sequence diagram in [1-system-overview.md](1-system-overview.md#main-flow-from-search-to-check-in).

## Likely questions

Security questions drawn from the course lectures, with answers, are in [COURSE_PROJECT.md §6](../COURSE_PROJECT.md#6-questions-to-expect-and-the-answer).

- **How do you stop double booking?** The API locks the resource row while booking. PostgreSQL also has an *exclusion constraint* that refuses any two slot-holding bookings that overlap on the same resource, so it holds even if the code had a bug.
- **Why a cookie instead of storing the token in the browser?** An `httpOnly` cookie cannot be read by JavaScript, so an injected script cannot steal the session.
- **How is it real-time?** Socket.IO. Clients join a room for the resource and day they are viewing, and the server pushes an event when a booking changes it.
- **How fast is it?** About 250 requests per second on one API process, with 0 errors up to 800 simultaneous users. Details: [performance comparison](../benchmarks/performance-comparison.md).
- **What would you improve?** Run several API processes, with Redis for the shared cache, rate limits and WebSocket events; add QR check-in; add email notifications.
