
# KanbanFlow Frontend

Modern real-time Kanban UI built with React, Vite, Tailwind CSS, and Socket.IO. The app connects to the backend API for auth, tasks, activity, uploads, and analytics.

## Live Demo

- https://kanbanflow-xi.vercel.app/

## Features

- Auth flows: register, login, logout
- Real-time Kanban board with drag-and-drop
- Task CRUD + move + reorder + status dropdown
- Priority, category, labels, due dates
- File uploads for tasks (images, PDFs)
- Live users badge + activity feed
- Analytics dashboards with Recharts

## Tech Stack

- React 18 + Vite
- Socket.IO client
- Framer Motion
- React DnD
- Recharts
- Tailwind CSS
- Vitest + React Testing Library
- Playwright for E2E

## Requirements

- Node.js 18+ (recommended)
- npm 9+

## Setup

```powershell
cd frontend
npm install
```

## Development

```powershell
cd frontend
npm run dev
```

Vite runs on `http://localhost:3000`.

## Build & Preview

```powershell
cd frontend
npm run build
npm run preview
```

## Tests

### Unit/Integration (Vitest)

```powershell
cd frontend
npm test
```

### E2E (Playwright)

Install browsers once:

```powershell
cd frontend
npx playwright install
```

Run the dev server in one terminal:

```powershell
cd frontend
npm run dev
```

Run tests in another terminal:

```powershell
cd frontend
npx playwright test --reporter=line
```

UI mode:

```powershell
npx playwright test --ui
```

HTML report:

```powershell
npx playwright test --reporter=html
npx playwright show-report
```

## Backend Connectivity

The frontend currently targets the deployed backend:

- API base URL: `https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com/api`
- Socket endpoint: `https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com`

To use a local backend, update these files:

- `src/api/http.js`
- `src/api/socket.js`

## Project Structure

```
frontend/
	src/
		api/                # Axios + socket client
		components/         # UI components
		context/            # Auth + Socket contexts
		pages/              # Routes (Home, Login, Register, Dashboard, Analytics)
		tests/              # Unit, integration, E2E
	playwright.config.js
	vite.config.js
```

## Troubleshooting

- If E2E tests show no output, confirm `npm run dev` is running and Playwright browsers are installed.
- If socket-related tests time out, ensure the backend server is running and reachable.
- If installs fail with peer conflicts, use `npm i --legacy-peer-deps` or downgrade React to a supported version.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm test` - run Vitest suite
- `npm run test:e2e` - run Playwright tests

