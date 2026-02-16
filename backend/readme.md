# 🚀 Real-Time Kanban Backend (Production-Ready)

A **production-grade real-time Kanban backend** built with Node.js, MongoDB, WebSockets, and cloud integrations.
This backend powers a collaborative Kanban board with real-time task updates, file uploads, activity tracking, authentication, and scalable architecture.

> 🔗 **Live Backend URL:**
> https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com

---

# 📌 Project Overview

This project implements a **real-time collaborative Kanban backend** designed using industry-level architecture and best practices.

It supports:

* Live task updates across multiple users
* Cloud-based file uploads
* Activity tracking
* JWT authentication
* Board settings + swimlanes + power-ups
* Labels, checklist, due dates, members, and task ordering
* Production-grade testing and deployment

The system is designed to be scalable, modular, and ready for real-world SaaS usage.

---

# 🏗 Tech Stack

### Backend

* Node.js + Express
* Socket.IO (real-time communication)
* MongoDB Atlas + Mongoose
* JWT Authentication
* Cloudinary (cloud file storage)

### Testing & Quality

* Vitest (unit + integration tests)
* Socket integration testing
* Morgan logging
* Express rate limiting

### Deployment

* Render (live production deployment)
* MongoDB Atlas (cloud database)
* Cloudinary (cloud file hosting)

---

# ⚡ Core Features

## 🧩 Real-Time Kanban System

* Create tasks
* Update tasks
* Delete tasks
* Move tasks between columns
* Reorder tasks within a column
* Labels, checklist items, due dates, and member assignments
* Multi-client real-time sync using WebSockets

All updates are instantly broadcast to connected users.

---

## 📂 Cloud File Uploads

* Secure file upload using Cloudinary
* Images & PDFs supported
* File metadata stored in MongoDB
* Attachments linked directly to tasks

---

## 🕒 Activity Timeline

Every action is logged:

* Task created
* Task moved
* Task updated
* Attachment added
* Task reordered

APIs available to fetch:

* Board activity
* Task-specific activity

---

## 👥 Live Online Users Tracking

Tracks active users in real time:

* User join/leave detection
* Live online count broadcast
* Useful for collaborative UI

---

## 🔐 JWT Authentication
# 🧭 Board Settings & Power-Ups

Board-level settings are now supported:

* Board name + description
* Background themes
* Swimlane mode (none, priority, member)
* Power-ups (calendar, analytics)

## 🧩 Trello-Style Task Metadata

Tasks now include:

* Labels
* Checklist items (with done status)
* Due dates
* Member assignments
* Ordering within each column

# 🌐 API Endpoints (New)

* GET /api/board → fetch board settings
* PUT /api/board/settings → update board settings
* GET /api/users → list users for member assignment

# 🔌 Socket Events (New)

* task:reorder → reorder tasks within a column


Authentication system implemented:

* User registration
* User login
* JWT token generation
* Protected route support (ready for frontend integration)

---

# 🧠 Scalable Architecture

The backend follows a clean service-based architecture:

```
backend/
 ├── models/          → MongoDB schemas  
 ├── services/        → business logic layer  
 ├── routes/          → REST endpoints  
 ├── socket/          → WebSocket handlers  
 ├── middleware/      → auth & security  
 ├── tests/           → unit & integration tests  
```

Separation of concerns ensures maintainability and scalability.

---

# 🧪 Testing

Implemented using **Vitest**:

### Unit Tests

* Task validation logic
* Service-layer error handling

### Integration Tests

* WebSocket connection test
* Real-time task creation test
* Multi-client broadcast testing

Ensures backend reliability and correctness.

---

# 🛡 Security & Production Middleware

* Rate limiting (anti-spam protection)
* Morgan logging (API monitoring)
* Environment variable configuration
* JWT token verification
* Cloud-based file storage (no local file dependency)

---

# 🌍 Deployment

Backend deployed on Render:

**Live URL:**
https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com

Connected services:

* MongoDB Atlas
* Cloudinary storage
* WebSocket live server

---

# 🎯 What This Backend Demonstrates

This project demonstrates strong understanding of:

* Real-time system design
* Backend architecture & scalability
* Cloud integrations
* Testing & reliability
* Production deployment
* Secure authentication
* Clean coding practices

It goes beyond a simple CRUD app and resembles a real-world collaborative SaaS backend.

---

# 🚀 Next Phase

Frontend implementation will include:

* Real-time Kanban UI (React)
* Drag & drop tasks
* Live updates across users
* File upload UI
* Charts & analytics
* Authentication UI

---

# 👨‍💻 Author

**MIDDE JAYANTH**
Full-Stack & AI Developer
Production-focused engineering | Real-time systems | Scalable backend architecture
