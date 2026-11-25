# CEW Crypto Frontend

React + Vite frontend for the CEW Crypto cryptocurrency platform.

## Getting Started

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and set your API URL:
   ```
   cp .env.example .env
   # Edit .env and set VITE_API_URL to your backend URL
   ```

3. Start the dev server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Pages

- `/support` — Contact form
- `/login` — User authentication with email/password + OTP
- `/admin/login` — Admin authentication with email/password + OTP
- `/admin/dashboard` — Admin dashboard with stats (protected)
- `/admin/users` — User management (protected)
- `/admin/messages` — Message management (protected)

## Environment Variables

| Variable       | Description                          |
|----------------|--------------------------------------|
| `VITE_API_URL` | Base URL of the backend API          |