# Rock Mission Ministries — Kids Corner Learning Web App

React (Vite) frontend for the Bible study learning platform, talking to the
Spring Boot API (`rockidz-api`) on Railway.

## Design system

Grounded in the ministry's own identity rather than generic template defaults:

- **Colors** — `rock-navy` (#1B2340, headers/nav — "built on the Rock"),
  `rock-stone` (#F2EEE3, background — quarried stone), `rock-amber` (#D89B3C,
  primary accent — dawn/light breaking through), `rock-moss` (#5C6E4F,
  success/completion states), `rock-brick` (#8A2E2E, errors only)
- **Type** — Instrument Serif (display), Inter (body/UI), JetBrains Mono
  (stats, progress numbers, labels)
- **Signature element** — `ProgressPath`: progress is shown as a row of
  stepping stones lighting up amber as lessons complete, not a generic bar —
  a path being walked, tying back to the ministry's own name and imagery

All tokens live in `tailwind.config.js`.

## What's built

- Auth (sign up / sign in), JWT stored client-side, attached to every API call
- Course catalog + course detail/syllabus page
- Enroll flow, including the `?action=enroll` deep-link support for buttons on
  the main rockmission.co.za site (see integration notes below)
- Student dashboard with per-course progress (`ProgressPath`)
- Course player: YouTube-embedded lessons, sidebar navigation, "mark complete"
  pings `PUT /api/lessons/{id}/progress`
- Educator "Teach" page: lists the signed-in educator's own courses
  (`GET /api/courses/mine`), create-course form with auto-slug generation,
  publish button
- Course builder (`/teach/:slug`): add/remove modules, add/remove lessons
  (title + YouTube video ID + optional duration), publish, and view the
  roster for that course — the full authoring loop is live end to end

## Known gaps to close in the next pass

- Module/lesson **reordering** isn't built — `orderIndex` is set automatically
  on creation (append to the end) but there's no drag-to-reorder or edit-in-place
  yet, so fixing a typo in a lesson title means delete-and-recreate.
- Lesson "mark complete" doesn't yet track real watch time from the YouTube
  player (YouTube IFrame API `onStateChange` would be the next step here,
  rather than always sending `watchTimeSeconds: 0`).
- No course/module/lesson **editing** — authoring only supports create and
  delete right now, not updating an existing title or description in place.

## Local development

```bash
copy .env.example .env
npm install
npm run dev
```

Make sure the Spring Boot API is running locally (`http://localhost:8080` by
default) and that `CORS_ALLOWED_ORIGINS` on the backend includes
`http://localhost:5173` (Vite's default dev port) — it already does in the
backend's `application.yml`.

`src/api/client.js` already reads `VITE_API_BASE_URL`, so local development can
use `.env` with `VITE_API_BASE_URL=http://localhost:8080` while production can
use `VITE_API_BASE_URL=https://rockidz-api.rockmission.co.za`.

## Deploying to GitHub Pages

This repo is now configured for the custom domain:

```text
https://rockidz.rockmission.co.za
```

`vite.config.js` uses `/` in production so assets load correctly from the custom domain root.

1. Push this repo to GitHub.
2. Set the production API URL for the build with either a GitHub Actions
   repository variable named `VITE_API_BASE_URL` or a local `.env.production`
   file before running `npm run build`.
3. Build and publish:
   ```bash
   npm run build
   npm run deploy   # runs gh-pages -d dist, pushes dist/ to the gh-pages branch
   ```
4. In the repo's GitHub Pages settings, set the source to the `gh-pages`
   branch. GitHub Pages will pick up `CNAME` automatically once it's on that
   branch (it's copied from `public/` into `dist/` at build time).
5. Add a CNAME record — `rockidz` → `<your-github-username>.github.io` — and
   keep the Vite production base at `/` for custom-domain hosting.
6. On the Railway backend, add a CNAME too: `api` → the Railway-provided
   domain, and set `CORS_ALLOWED_ORIGINS=https://rockidz.rockmission.co.za` in
   Railway's environment variables (replacing the localhost-only default).

## Linking from the main ministry site

Add a button/nav link on rockmission.co.za pointing to:

```text
https://rockidz.rockmission.co.za/activities/{slug}?action=enroll
```

If the visitor isn't signed in, `ProtectedRoute` and the redirect-after-auth
logic in `SignIn`/`SignUp` will bounce them through sign-up/sign-in and land
them back on that course ready to enroll — no separate integration needed on
the main site beyond the link itself.
