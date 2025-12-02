# Frontend for Project URL Shortener

This is a small React + Vite + Tailwind frontend for the URL shortener backend.

Run locally:

```powershell
cd frontend
npm install
npm run dev
```

The frontend defaults to calling the backend at `http://localhost:8000`. To change that, set environment variable `VITE_API_URL` when running Vite, e.g.:

```powershell
npm run dev -- --host --port 5173
```

Open http://localhost:5173
