# Task Manager App — Master Branch

This is the production branch. It runs the full stack application behind Nginx
with security hardening, rate limiting, and persistent data storage.

## Branch Purpose
Production-ready deployment. Only stable, tested code merged from dev reaches this branch.
Every push triggers an automatic redeploy via Jenkins CI pipeline.

## Tech Stack
- React 19 + Vite (served as static files via Nginx)
- Node.js + Express.js
- MongoDB
- Redis (rate limiting)
- Docker + Docker Compose
- Nginx (reverse proxy + static file server)
- Jenkins (CI/CD)

## Project Structure
```
back/
├── src/
│   ├── controllers/
│   ├── middleware/
│   │   ├── error.js
│   │   ├── jwtauth.js
│   │   └── ratelimiter.js
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
Dockerfile         # root - builds nginx + React static files
app.conf           # nginx config
docker-compose.prod.yml
Jenkinsfile
```

## Running Locally
```bash
docker compose -f docker-compose.prod.yml up --build
```
- App available at: http://localhost (port 80 via Nginx)
- Backend runs internally on port 5000 (not exposed publicly)

## Environment Variables
Create `.env` in root directory:
```env
NODE_ENV=production
MONGO_URL=mongodb://mongo:27017/mydb_prod
JWT_SECRET=supersecretkey
REDIS_URL=redis://redis:6379
```

Create `front/.env`:
```env
VITE_API_URL=/back
```

## Security Features
- **Helmet** — sets secure HTTP headers on all responses
- **General rate limiter** — 100 requests per 10 minutes per IP on all `/back` routes
- **Auth rate limiter** — 10 requests per 10 minutes per IP on `/signup` and `/signin`
- **JWT authentication** — all protected routes require valid token
- **Redis-backed rate limiting** — persistent across server restarts

## CI Pipeline Flow
```
Push to master branch
→ Jenkins triggers via GitHub webhook
→ Setup Env (inject .env and front/.env from Jenkins credentials)
→ docker compose down old containers
→ docker compose up --build -d (nginx, back, mongo, redis)
→ Cleanup old images
```

## Services
- **nginx** — serves React static files on port 80, proxies /back/ to Express
- **back** — Express API on port 5000 (internal only)
- **mongo** — MongoDB with persistent volume
- **redis** — rate limiting store with persistent volume

## Branch Flow
```
test → dev → master
```
- Features are tested in test branch
- Integrated and verified in dev branch  
- Deployed to production via master branch

# jenkins check