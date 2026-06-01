## Goal
Add an admin login so nenongwen@gmail.com can manage the website's projects and pricelists without code changes.

## What you'll get
- **Login page** at `/login` (email + password). Only signed-in admins reach the admin area.
- **Admin dashboard** at `/admin` with two sections:
  - **Projects** — add/edit/delete projects (title, year, location, type, cover image upload). The public `/projects` page reads from the database, so updates appear instantly.
  - **Pricelists** — add/edit/delete price items (name, description, price, category). A new public `/pricing` page displays them.
- **Image uploads** handled via Cloud storage (no more hardcoded image imports for new projects).
- The 10 existing projects get seeded into the database so nothing disappears.

## Access control
- Lovable Cloud auth with email/password.
- A `user_roles` table + `has_role()` security-definer function (secure pattern — roles never on profile table).
- `nenongwen@gmail.com` is granted the `admin` role on first sign-in via a trigger that checks the email.
- RLS: only admins can insert/update/delete projects & pricelists; everyone can read.

## Tech
- Enable **Lovable Cloud** (database + auth + storage).
- Tables: `projects`, `pricelist_items`, `user_roles` (+ `app_role` enum).
- Storage bucket: `project-images` (public read).
- New routes: `/login`, `/admin` (protected layout), `/admin/projects`, `/admin/pricelists`, `/pricing` (public).
- Update existing `/projects` route to fetch from DB instead of static `src/lib/projects.ts`.

## Not included (ask if you want them)
- Password reset flow
- Multiple admin users / inviting other admins from the UI
- Editing About/Contact page copy from the admin (only projects + pricelists)

Confirm and I'll build it.