# WebSocket Kanban Board

Real-time Kanban board with a React frontend and a Socket.IO + Express backend. Tasks sync across clients, support attachments, and are tracked with activity logs and analytics.

## Quick Links

- Frontend details: [frontend/readme.md](frontend/readme.md)
- Backend details: [backend/readme.md](backend/readme.md)
- Live frontend: https://kanbanflow-xi.vercel.app/
- Live backend: https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com

## Features

- Real-time task create/update/move/delete with Socket.IO
- Drag-and-drop Kanban columns (To Do, In Progress, Done)
- Priority, category, labels, due dates, and attachments
- Auth flows with JWT and protected APIs
- Activity feed and live online users
- Unit/integration tests (Vitest) and E2E tests (Playwright)

## Architecture

The app is split into two services:

- Frontend (React + Vite): UI, state, DnD, charts, and Socket.IO client
- Backend (Express + Socket.IO): REST APIs, WebSocket events, auth, file uploads, and persistence

Data flow:

1. The UI sends REST calls for auth, uploads, and board settings.
2. The UI emits Socket.IO events for real-time task changes.
3. The backend persists tasks in MongoDB and broadcasts updates to all connected clients.
4. Attachments are stored via Cloudinary and linked to tasks.

## Folder Structure

```
websocket-kanban-vitest-playwright-2026/
  backend/
    config/            # MongoDB + Cloudinary config
    middleware/        # Auth and security
    models/            # Mongoose schemas
    routes/            # REST APIs
    services/          # Business logic
    socket/            # Socket.IO handlers
    tests/             # Backend tests (Vitest)
    server.js          # Express + Socket.IO entry
  frontend/
    public/
    src/
      api/             # Axios + socket client
      components/      # UI components
      context/         # Auth + Socket contexts
      pages/           # App routes
      tests/           # Unit, integration, E2E
    playwright.config.js
    vite.config.js
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Cloudinary credentials (for attachments)

## Environment Variables (Backend)

Create a .env file in backend with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

## Installation

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Run Locally

Backend (port 5000 by default):

```powershell
cd backend
npm run dev
```

Frontend (port 3000):

```powershell
cd frontend
npm run dev
```

To point the frontend at a local backend, update:

- [frontend/src/api/http.js](frontend/src/api/http.js)
- [frontend/src/api/socket.js](frontend/src/api/socket.js)

## Testing

Backend (Vitest):

```powershell
cd backend
npm test
npm run test:watch
```

Frontend (Vitest):

```powershell
cd frontend
npm test
```

E2E (Playwright):

```powershell
cd frontend
npx playwright install
npm run dev
```

In another terminal:

```powershell
cd frontend
npm run test:e2e
```

## WebSocket Events

The backend emits and listens to these events:

- sync:tasks
- task:create / task:created
- task:update / task:updated
- task:move / task:moved
- task:reorder
- task:delete / task:deleted
- attachment:add / attachment:added
- users:online
- users:identify
