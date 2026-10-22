# Restaurant Reservation System --- Frontend README

## Overview

This repository contains the React/Vite frontend for the restaurant
reservation system. One application hosts the customer-facing restaurant
website and the admin portal. The frontend communicates with a Django
REST Framework backend; the backend remains the source of truth for
reservations, menu data, capacity, authentication, permissions, and
dashboard metrics.

### Main features

-   Restaurant homepage and informational sections.
-   Menu browsing and menu-item selection.
-   Date/time and guest selection in the booking flow.
-   Customer details and email OTP verification.
-   Reservation confirmation and active-reservation restoration.
-   Customer reservation page where configured.
-   Admin login and OTP verification.
-   Admin dashboard charts and summary cards.
-   Read-only admin reservation search, filters, pagination, and
    details.
-   Admin menu category and item management.

## Contents

-   [Technology stack](#technology-stack)
-   [Prerequisites](#prerequisites)
-   [Project structure](#project-structure)
-   [Install and run](#install-and-run)
-   [Environment variables](#environment-variables)
-   [Application architecture](#application-architecture)
-   [Routes](#routes)
-   [Customer booking flow](#customer-booking-flow)
-   [API client](#api-client)
-   [Cookies and CSRF](#cookies-and-csrf)
-   [Admin portal](#admin-portal)
-   [Menu data and images](#menu-data-and-images)
-   [Styling](#styling)
-   [State management](#state-management)
-   [Accessibility](#accessibility)
-   [Build and deployment](#build-and-deployment)
-   [Troubleshooting](#troubleshooting)
-   [Quality checklist](#quality-checklist)
-   [Compose YAML Details](#compose-yaml-details)

## Technology stack

The current project uses a Vite-style React setup, JavaScript/JSX, React
Router, Bootstrap-compatible CSS utilities, custom CSS, and `fetch` for
API requests. Bootstrap Icons and other vendor assets may be used by the
restaurant template.

Check `package.json` for the exact package versions and available
scripts. Do not assume that optional lint/test/chart scripts exist
unless they are defined there.

## Prerequisites

Install Node.js compatible with the project's Vite version, npm (or the
package manager indicated by the lockfile), Git, and the backend service
for end-to-end testing.

``` bash
node --version
npm --version
```

## Project structure

The exact repository may contain additional files. This is a guide to
the current Vite-style structure:

``` text
frontend/
├── public/                 # Public-root files
├── src/
│   ├── assets/             # Imported images/assets
│   ├── components/
│   │   ├── common/         # Shared UI and reusable components
│   │   └── ...             # Feature components
│   ├── pages/              # Route-level pages
│   ├── hooks/              # Reusable React hooks
│   ├── utils/              # Helpers/API client
│   ├── constant-data/      # Static reference data
│   ├── app.jsx             # Application composition/routes, depending on current setup
│   └── main.jsx            # React entry point/providers
├── index.html
├── package.json
├── package-lock.json       # If npm lockfile is used
└── vite.config.js          # If present
```

The actual source tree and route configuration are authoritative.

## Install and run

Install dependencies from the frontend root:

``` bash
npm install
```

Start Vite:

``` bash
npm run dev
```

Use the local URL printed in the terminal, commonly
`http://localhost:5173`.

Inspect `package.json` for available scripts. Common Vite scripts
include:

``` bash
npm run dev
npm run build
npm run preview
```

Only run scripts that actually exist in this repository.

## Environment variables

The API client currently uses this base URL pattern:

``` javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";
```

Create `.env` in the frontend root: (env file not configured yet)

``` dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Restart Vite after changing environment variables. Variables prefixed
with `VITE_` are exposed to browser code and can appear in the built
bundle. Never put private credentials, server secrets, or database
passwords in frontend environment variables.

## Application architecture

``` text
React application
├── Customer website
│   ├── Header / navigation
│   ├── Home page sections
│   ├── Menu
│   ├── BookingFlow
│   ├── Reservation page
│   └── Footer
└── Admin portal
    ├── Login and OTP
    ├── Dashboard
    ├── Reservations
    └── Menu management

All API requests --> Django REST API
```

The customer homepage has been composed from sections such as `Hero`,
`About`, `WhyUs`, `Menu`, `Chefs`, `BookingFlow`, `Gallery`, and
`Contact`. The application has also used page components such as
`BookTablePage`, `LocationDateTimePage`, `MenuPage`, and `ContactPage`;
check the current route tree to confirm which are still separate routes.

### Component design

-   Use pages to compose route-level screens.
-   Use reusable components for repeated UI patterns.
-   Keep state near the feature that owns it.
-   Share state only where multiple components genuinely need the same
    source of truth.
-   Use a small feature-level context or shared hook when needed instead
    of passing props through many unrelated layers.
-   Avoid one giant context for unrelated booking, menu, dashboard, and
    auth state.
-   Avoid `useMemo`, `useCallback`, and `memo` by default; introduce
    them when there is a measured performance or dependency-stability
    reason.

## Routes

The customer website root route is `/`. The admin portal base route is
`/admin_portal/`. The current application also includes
`/my-reservations` where configured.

Conceptual route map:

``` text
/
└── HomePage
    ├── Header
    ├── Hero
    ├── About
    ├── WhyUs
    ├── Menu
    ├── Chefs
    ├── BookingFlow
    ├── Gallery
    ├── Contact
    └── Footer

/my-reservations
└── MyReservations

/admin_portal/
├── Login / OTP
├── Dashboard
├── Reservations
└── Menu management
```

Use the real `Routes` definitions in the repository for the exact route
list. Frontend route guards improve navigation but do not provide
security by themselves; backend permissions must protect the data.

## Customer booking flow

The backend owns the active reservation. `BookingFlow` requests:

``` text
GET /reservations/
```

This is relative to the configured API base URL. With the default base
URL it is beneath `/api/v1`.

The returned status controls which UI step appears:

  API status               UI behavior
  ------------------------ --------------------------------------
  `DRAFT`                  Show the draft/menu-selection step.
  `PENDING_VERIFICATION`   Show email OTP verification.
  `CONFIRMED`              Show the confirmation/success state.
  No active reservation    Show the initial booking step.

Recommended sequence:

1.  Initialize CSRF when needed.
2.  Fetch the active reservation.
3.  Render the step appropriate to the server status.
4.  Submit draft or menu changes to the API.
5.  Finalize the draft.
6.  Display OTP verification.
7.  Submit the OTP.
8.  Update the current booking from the API response.
9.  Show success only after the backend confirms success.
10. Handle expiry, cancellation, and request errors explicitly.

When a child booking component successfully updates the reservation,
return the updated reservation data to the parent so the parent can
update its `booking` state. Do not optimistically claim that a
reservation was confirmed before the server reports success.

Avoid creating a separate browser-only reservation record that can drift
from the backend. This project design does not use localStorage as
reservation persistence.

## API client

The shared API client centralizes:

-   API base URL handling.
-   Cookie inclusion with `credentials: "include"`.
-   JSON request headers.
-   Correct handling of `FormData`.
-   CSRF header injection for unsafe methods.
-   JSON response parsing.
-   Error objects containing status and response data.

Example usage (adjust the import path to the actual location of the
helper):

``` javascript
import { apiRequest } from "../utils/api";

const activeReservation = await apiRequest("/reservations/active/");
```

The current helper throws an `Error` with properties such as `status`,
`code`, and `data`. Components should use these properties to display
appropriate messages and should not expose raw server tracebacks.

Use the correct HTTP method for each endpoint, send only
serializer-supported fields, and handle validation errors,
authentication failures, server errors, and network failures. The
frontend is not trusted to enforce prices, slot capacity, ownership, or
admin permissions.

## Cookies and CSRF

The API client includes cookies in requests:

``` javascript
credentials: "include"
```

The CSRF initialization helper has used:

``` javascript
export async function initializeCsrf() {
  await fetch(`${API_BASE_URL}/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}
```

Confirm the path against the backend URL configuration.

For unsafe methods such as `POST`, `PATCH`, `PUT`, and `DELETE`, the API
client reads the `csrftoken` cookie and sends `X-CSRFToken`. The admin
session cookie is HttpOnly and must not be read by JavaScript.

CORS and CSRF are different mechanisms. CORS controls cross-origin
browser access; CSRF protects cookie-authenticated mutation requests. Do
not disable backend CSRF protection to work around a CORS error.

## Admin portal

The admin portal uses a custom backend login flow:

1.  Submit username/email and password.
2.  Backend validates credentials and sends an OTP.
3.  Show the OTP screen using the challenge token returned by the
    backend.
4.  Submit the OTP.
5.  Backend creates an admin session and sets the HttpOnly cookie.
6.  Fetch the admin identity endpoint to verify the session.
7.  Render protected pages.
8.  On logout, call the backend logout endpoint and update the UI.

Do not store the raw admin session token in localStorage or
sessionStorage.

### Dashboard

The dashboard can display summary cards, reservation trends over a
selected date range, peak hours, slot popularity, and trending special
food items. Use the backend responses as the source of truth; format
values for presentation but do not reconstruct authoritative metrics
from incomplete client-side records.

### Reservations

The admin reservations screen is read-only under the current
requirements. It supports search, date range, status filtering,
pagination, and detail inspection. A desktop table and mobile cards can
present the same data responsively. The frontend must not add
edit/cancel controls unless the backend requirements and permissions are
deliberately changed.

### Menu management

The menu admin supports category and item management. Item list filters
include search, category, special status, availability, page, and page
size. The backend soft-deletes menu items, so deleted records disappear
from the normal list while historical reservation references remain.

## Menu data and images

Menu data commonly includes `id`, `category`, `category_name`, `title`,
`description`, `src`, `price`, `is_special`, and `is_available`. The
admin API can also expose `seed_key`, `is_deleted`, and timestamps.

The `src` value must resolve to a browser-accessible URL. A path on a
developer's local disk is not automatically accessible to a browser.
Depending on the deployment, images may be public-root assets, Django
static/media files, or externally hosted URLs.

### Uniform image sizes without cropping

For menu cards that must not crop or stretch images, use a consistent
container height and `object-fit: contain`:

``` css
.menu-selection-image {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.menu-selection-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
```

Use a corresponding class for regular menu grid images. `contain` shows
the whole image but may leave whitespace around images with different
aspect ratios. `cover` fills the area but crops images and should not be
used when cropping is forbidden.

Use a shared price-formatting helper where the same currency is
displayed in multiple components. The backend price remains
authoritative.

## Styling

The app uses Bootstrap-compatible classes alongside custom CSS. Common
examples include:

-   Grid: `row`, `col-lg-4`, `col-md-6`.
-   Flex: `d-flex`, `justify-content-between`, `align-items-center`.
-   Spacing: `gap-*`, `mt-*`, `mb-*`, `p-*`.
-   Images: `img-fluid`, `w-100`.
-   Icons: Bootstrap Icons classes where the stylesheet is loaded.

Keep styles scoped to component-specific classes such as
`.menu-selection-image`, `.menu-selection-img`, and `.menu-card-img`.
Avoid broad rules that unintentionally affect all images or override
Bootstrap behavior. Check stylesheet import order and network errors if
vendor classes do not work.

Copying template HTML into React does not automatically install the
template's CSS, fonts, JavaScript plugins, or images. Verify all
required assets are imported or served from valid paths.

## State management

Use the smallest state scope that matches the data:

-   Local component state for isolated form inputs, dropdowns, and
    temporary UI state.
-   Feature-level shared state for data used by multiple booking steps.
-   API requests for server-owned reservations, menu records, admin
    identity, and dashboard data.

Update state from successful API responses. Avoid duplicating
reservation state in multiple components without a synchronization
strategy. Avoid giant contexts and unnecessary memoization. Backend
cookies/database---not browser localStorage---are the source of truth
for session and reservation persistence in this design.

## Error handling and accessibility

Every asynchronous view should handle loading, empty results, validation
errors, authentication expiry, permission failures, network errors, and
success. Disable submit controls while a mutation is in progress to
avoid accidental repeated requests. Show user-friendly messages, not
server tracebacks.

Accessibility checklist:

-   Prefer semantic buttons for actions.
-   Provide keyboard operation and visible focus for interactive cards.
-   Use `aria-pressed` for toggle selections when appropriate.
-   Ensure disabled items cannot be activated.
-   Give meaningful images useful alt text; decorative images can use
    empty alt text.
-   Associate labels and validation errors with form controls.
-   Do not use color as the only status indicator.
-   Maintain adequate contrast and responsive layout.
-   Announce important validation and booking-state changes accessibly.

A clickable `div` requires extra keyboard and focus handling; use a
native button when it fits the component design.

## Build and deployment

Build for production:

``` bash
npm run build
```

Vite normally emits files to `dist/`; confirm `vite.config.js`. If
available, preview the build locally:

``` bash
npm run preview
```

Deployment requirements:

-   Set `VITE_API_BASE_URL` to the production API URL before building.
-   Configure backend CORS and CSRF trusted origins for the deployed
    frontend.
-   Serve the frontend over HTTPS.
-   Configure backend cookie `Secure` and `SameSite` behavior for the
    deployment domains.
-   Configure the web host to serve the SPA entry point for routes such
    as `/my-reservations` and `/admin_portal/`.
-   Verify static and menu image URLs.
-   Never put server secrets in frontend environment variables.
-   Test login, OTP, logout, and refresh behavior on the real deployed
    domain.

`VITE_` values are public and embedded in the client build.

## Troubleshooting

### API requests fail

Confirm Django is running, inspect `VITE_API_BASE_URL`, check endpoint
paths/trailing slashes, and inspect the Network tab for the request URL,
status, and response.

### CORS errors

Verify the exact browser origin and backend allowlist. Credentialed
requests need compatible CORS settings. Do not use wildcard origins with
cookies.

### CSRF errors

Initialize CSRF, confirm the `csrftoken` cookie exists, send
`X-CSRFToken` on unsafe methods, include credentials, and trust the
correct origin in Django. Do not disable CSRF.

### Admin is logged out after refresh

Call the admin identity endpoint at initialization, inspect whether the
browser sends the `admin_session` cookie, check expiry/revocation, and
review cookie domain, Secure, and SameSite settings.

### Only one menu item appears

Inspect the actual request URL and query parameters. Check
`page_size=1`, category/search/special/availability filters, API
`count`, and `results.length` before changing rendering code.

### Images look uneven

Use a fixed-height image area and `object-fit: contain` to avoid
crop/distortion. Empty space around images with different aspect ratios
is expected.

### Bootstrap classes have no effect

Check that Bootstrap CSS is loaded, inspect stylesheet 404s, verify
import order, check for overriding custom rules, and confirm class
names. Template markup alone does not include its styles or plugins.

### Refreshing a route returns 404

Configure the hosting platform to serve the SPA entry point for
client-side routes while routing API paths to Django.

## Development quality checklist

-   [X] Loading, empty, error, and success states are handled.
-   [X] Forms show backend validation errors.
-   [ ] Mutations prevent accidental duplicate submissions.
-   [X] Booking steps follow backend reservation status.
-   [X] Admin pages handle expired sessions and permission failures.
-   [X] Search, filters, and pagination send the intended query
    parameters.
-   [X] Images load from valid URLs and display consistently.
-   [X] Layout works on mobile and desktop.
-   [ ] Keyboard navigation and focus indicators work.
-   [X] No private secrets are stored in browser storage or exposed in
    the build.
-   [ ] Production build succeeds.
-   [ ] Browser console has no unexpected errors.
-   [ ] ENV File created and configured.
-   [ ] Session initialization by the server first rather than by frontend sending a session value when the frontend first loads.
-   [ ] Complete code review against security checks.
-   [ ] Admin Portal updation, making it more clean.

## Implementation notes

-   Customer root route: `/`.
-   Admin portal base route: `/admin_portal/`.
-   Reservation page route has included `/my-reservations`.
-   Default API base: `http://127.0.0.1:8000/api/v1`.
-   Requests include cookies with `credentials: "include"`.
-   The CSRF token is sent in `X-CSRFToken` for unsafe methods.
-   Active reservation state is restored from the backend.
-   Admin session is held in an HttpOnly cookie, not localStorage.
-   Admin reservations are read-only in the current requirements.
-   Exact routes, file names, package versions, and scripts must be
    confirmed against the current repository.

## Compose YAML Details

    services:
    frontend:
        build:
        context: ./frontend
        dockerfile: Dockerfile
        ports:
        - "5173:5173"
        environment:
        VITE_API_BASE_URL: /api/v1
        CHOKIDAR_USEPOLLING: "true"

        volumes:
        - type: bind
            source: ./frontend
            target: /app
        - type: volume
            source: frontend_node_modules
            target: /app/node_modules
        depends_on:
        - backend

    backend:
        build:
        context: ./backend
        dockerfile: Dockerfile
        env_file:
        - ./backend/.env
        ports:
        - "8000:8000"
        volumes:
        - type: bind
            source: ./backend
            target: /app
        command: >
        sh -c "python manage.py migrate &&
                python manage.py runserver 0.0.0.0:8000"
        depends_on:
        redis:
            condition: service_healthy

    celery:
        build:
        context: ./backend
        dockerfile: Dockerfile
        env_file:
        - ./backend/.env
        volumes:
        - type: bind
            source: ./backend
            target: /app
        command: celery -A config worker --loglevel=info
        depends_on:
        redis:
            condition: service_healthy

    redis:
        image: redis:7-alpine
        command: redis-server --appendonly yes
        volumes:
        - redis_data:/data
        healthcheck:
        test: ["CMD", "redis-cli", "ping"]
        interval: 5s
        timeout: 3s
        retries: 10

    volumes:
    frontend_node_modules:
    redis_data:
