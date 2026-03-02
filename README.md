# Task Manager App — Dev Branch

This branch runs the full stack application in development mode with hot reload.
It is the integration branch — features are tested here before merging to master.

## Branch Purpose
Runs the complete development environment locally via Jenkins CI pipeline.
Every push triggers an automatic redeploy of all services.

## Tech Stack
- React 19 + Vite (frontend with HMR)
- Node.js + Express.js (backend with nodemon)
- MongoDB
- Redis (rate limiting)
- Docker + Docker Compose
- Jenkins (CI)
- Nginx (production only — not used in this branch)

## Project Structure
```
back/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── .dockerignore
├── Dockerfile
├── index.js
└── package.json
front/
├── src/
├── Dockerfile
└── package.json
docker-compose.dev.yml
Jenkinsfile
```

## Running Locally
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Redis: localhost:6379

## Environment Variables
Create `.env.dev` in root directory:
```env
NODE_ENV=development
MONGO_URL=mongodb://mongo:27017/mydb_dev
JWT_SECRET=supersecretkey
REDIS_URL=redis://redis:6379
```

Create `front/.env`:
```env
VITE_API_URL=/back
```

## CI Pipeline Flow
```
Push to dev branch
→ Jenkins triggers via GitHub webhook
→ Setup Env (inject credentials as .env.dev and front/.env)
→ docker compose down old containers
→ docker compose up --build -d (all 4 services)
→ Cleanup old images
```

## Services
- **front** — Vite dev server with hot reload on port 5173
- **back** — Express with nodemon, restarts on code changes
- **mongo** — MongoDB with persistent volume
- **redis** — Rate limiting store

# jenkins check