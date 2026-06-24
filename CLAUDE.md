# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN stack project split into two top-level directories:

- `BE/` — Node.js/Express backend (REST API + MongoDB via Mongoose)
- `FE/` — React frontend (Vite or Create React App)

Both directories are currently empty and need to be scaffolded.

## Development Commands

### Backend (`BE/`)

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with nodemon
npm start            # Start production server
npm test             # Run tests
```

### Frontend (`FE/`)

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run tests
```

## Architecture

### Backend

Expected structure once scaffolded:
- `src/config/` — DB connection, environment config
- `src/models/` — Mongoose schemas
- `src/controllers/` — Route handler logic
- `src/routes/` — Express router definitions
- `src/middleware/` — Auth (JWT), error handling, validation
- `server.js` or `app.js` — Entry point

### Frontend

Expected structure once scaffolded:
- `src/components/` — Reusable UI components
- `src/pages/` — Route-level page components
- `src/services/` or `src/api/` — Axios/fetch wrappers for backend calls
- `src/context/` or `src/store/` — Global state (Context API or Redux)

## Environment Variables

Backend typically requires a `.env` file in `BE/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/<dbname>
JWT_SECRET=<secret>
```

Frontend typically requires a `.env` file in `FE/`:

```
VITE_API_URL=http://localhost:5000/api
```
