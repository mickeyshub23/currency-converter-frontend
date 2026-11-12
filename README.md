# Currency Converter Frontend

Simple HTML/CSS/JS frontend that converts currencies by calling the backend API.

## Local setup

1. Open `index.html` in a browser, or serve with any static server.
2. Edit the `window.API_BASE_URL` value in `index.html` (or keep `.env.example` value) to point at your deployed Render backend, e.g. `https://currency-converter-backend.onrender.com`.

## Deploy on Vercel

1. Push this folder to its own GitHub repository.
2. In Vercel, import the repo and deploy (static HTML preset).
3. Set the environment variable `API_BASE_URL` to your Render backend URL.
4. Update `window.API_BASE_URL` in `index.html` to match, then redeploy.
