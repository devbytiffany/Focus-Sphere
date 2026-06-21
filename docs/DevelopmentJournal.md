# Development Journal

## Day 1
**Date:** 2026-06-18
**What I learned:** Set up GitHub repository for Focus Sphere
**What I built:** README.md and project structure
**Problems encountered:** None
**Next steps:** Create database folder

## Day 2
**Date:** 2026-06-19
**What I learned:** Created a PostgreSQL database on Supabase with 7 tables
**What I built:** users, category, priorities, task_status, tasks, events, focus_sessions tables
**Problems encountered:** status table already existed, renamed to task_status. Fixed foreign key type mismatch error.
**Next steps:** Set up the backend

## Day 3
**Date:** 2026-06-19
**What I learned:** Created a backend server using Node.js and Express
**What I built:** index.js with a working server running on port 3000
**Problems encountered:** echo. command doesn't work in PowerShell, used New-Item instead
**Next steps:** Connect backend to Supabase database

## Day 4
**Date:** 2026-06-19
**What I learned:** Connected Express backend to Supabase database using @supabase/supabase-js
**What I built:** Supabase client connection, /test-db route to verify connection
**Problems encountered:** Typo - wrote res.join instead of res.json
**Next steps:** Build user registration (Sign Up) endpoint

## Day 5
**Date:** 2026-06-19
**What I learned:** Built and tested a user registration endpoint with password hashing using bcrypt
**What I built:** POST /register route, tested with Postman, verified data in Supabase
**Problems encountered:** Duplicate createClient import causing SyntaxError
**Next steps:** Build user login endpoint

## Day 6
**Date:** 2026-06-19
**What I learned:** Built and tested a login endpoint using bcrypt.compare to verify hashed passwords
**What I built:** POST /login route, tested with Postman
**Problems encountered:** Typed wrong password during testing, confirmed bcrypt correctly rejected it
**Next steps:** Build logout functionality

## Day 7
**Date:** 2026-06-19
**What I learned:** Built JWT-based authentication with middleware to protect routes
**What I built:** jwt token generation in /login, verifyToken middleware, protected /profile route, /logout route
**Problems encountered:** Typo - req.header instead of req.headers in middleware
**Next steps:** Sprint 1 complete. Plan Sprint 2 - Task management (CRUD operations)

## Day 8
**Date:** 2026-06-20
**What I learned:** Built full CRUD operations for tasks, learned about route parameters (:id) and HTTP methods PUT/DELETE
**What I built:** POST /tasks, GET /tasks, PUT /tasks/:id, DELETE /tasks/:id - all scoped to the logged-in user
**Problems encountered:** Typo - period instead of comma in app.put() broke route registration; duplicate test tasks from earlier debugging, cleaned up using DELETE route
**Next steps:** Sprint 2 complete. Push to GitHub, then plan Sprint 3

## Day 9
**Date:** 2026-06-21
**What I learned:** Reused the CRUD pattern from Tasks to quickly build Category, Priorities, and Task Status routes; learned when NOT to scope by user_id (shared reference data)
**What I built:** Full CRUD for categories and priorities, Create + Read only for task_status (shared data, no update/delete to avoid breaking things for other users)
**Problems encountered:** None - pattern reuse made this fast
**Next steps:** Build Events CRUD

## Day 10
**Date:** 2026-06-21
**What I learned:** Completed Events CRUD; learned that missing one route during manual typing can break only that specific request, not the whole server
**What I built:** Full CRUD for events (create, read, update, delete), scoped to logged-in user
**Problems encountered:** POST /events route was missing after typing in the other three - traced and fixed by comparing against the full file
**Next steps:** Build Focus Sessions routes, then plan deployment

## Day 11
**Date:** 2026-06-21
**What I learned:** Built start/stop pattern for focus sessions; learned about TIMESTAMP vs TIMESTAMPTZ and how missing timezone info causes incorrect duration calculations
**What I built:** POST /focus-sessions/start, PUT /focus-sessions/:id/stop (calculates duration), GET /focus-sessions, DELETE /focus-sessions/:id
**Problems encountered:** Duration was wildly incorrect (11121 instead of ~322 seconds) due to TIMESTAMP columns lacking timezone info; fixed by altering columns to TIMESTAMPTZ
**Next steps:** All database tables now have working backend routes. Plan deployment or start frontend

## Day 12
**Date:** 2026-06-21
**What I learned:** Built profile update (with email conflict checking) and change password routes; learned Postman keeps separate Authorization headers per tab, which caused confusing "invalid token" errors across different test requests
**What I built:** PUT /profile (update name/email/password with conflict checking), PUT /profile/change-password (verifies current password before allowing change)
**Problems encountered:** Spent a long time debugging "invalid or expired token" - root cause was a stale token saved in one specific Postman tab's Headers, not a code bug
**Next steps:** Build dashboard/analytics endpoint, then move to deployment

## Day 13
**Date:** 2026-06-21
**What I learned:** Built a dashboard/analytics endpoint using .reduce() to sum values across records, .gte() for date filtering, and modulo (%) math to format seconds into readable hours/minutes
**What I built:** GET /dashboard - returns total tasks, total focus time (seconds, minutes, and formatted as "Xh Ym"), and count of upcoming events
**Problems encountered:** None
**Next steps:** Backend feature-complete. Move to deployment, then frontend

## Day 14
**Date:** 2026-06-21
**What I learned:** Deployed the backend to Render, connected to GitHub for auto-deploy on push, configured environment variables securely on the hosting platform, learned free tier services spin down after inactivity
**What I built:** Live backend at https://focus-sphere.onrender.com, fully connected to Supabase in production. Protected the /test-db route with verifyToken and removed exposed password field
**Problems encountered:** Initial deploy attempt prompted for a credit card unexpectedly (known intermittent Render issue); resolved by explicitly confirming Free instance type
**Next steps:** Backend is feature-complete and deployed. Move to frontend development, then connect frontend to this live backend URL
