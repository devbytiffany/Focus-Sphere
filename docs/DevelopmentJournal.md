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
