# BSCF Task Manager & Workspace

Official project & task management workspace for the **Bangladesh Socio-Cultural Forum (BSCF)**.

## 🚀 Overview

- **Core Views**: Kanban Board, Tabular View, Interactive Calendar, Team Capacity & Task Overview.
- **Team**: Complete official roster of 28 members across BSCF Core Team & Youth Network.
- **Docs & Notes**: Built-in rich document workspace for meeting minutes, guidelines, and project specs.
- **Real-Time Updates**: Instant bi-directional sync powered by WebSockets (Socket.io).
- **Persistent Storage**: Cloud-hosted **MongoDB Atlas** for long-term data security and automated backups.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons, Custom Illustrated Visuals.
- **Backend**: Node.js, Express, Socket.io, Mongoose.
- **Database**: MongoDB Atlas.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string (or local MongoDB)

### 2. Environment Variables
In `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bscf_taskmanager?retryWrites=true&w=majority
```

In `client/.env.local` (optional, defaults to `http://localhost:5000`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Run Locally
Run both frontend and backend concurrently:
```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment Guide

### Backend (Render / Railway / Koyeb)
1. Deploy the `server/` directory as a Node.js web service.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set environment variable: `MONGODB_URI` with your MongoDB Atlas connection string.

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://<your-backend-domain>`
4. Deploy!
