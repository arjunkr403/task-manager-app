# Task Manager App — Test Branch

This branch is dedicated to running automated tests for the backend API.
It spins up only the backend and MongoDB — no frontend, no Redis.

## Branch Purpose
Validates core backend logic on every push via Jenkins CI pipeline.
If tests fail, the pipeline fails and changes should not be merged to dev.

## Tech Stack
- Node.js + Express.js
- MongoDB
- Jest (unit testing)
- Docker + Docker Compose
- Jenkins (CI)

## What Gets Tested
- **Auth utilities** — bcrypt password hashing and JWT sign/verify
- **Mongoose models** — schema validation and default values for User, Board and Task

## Project Structure
```
back/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── tests/
│       ├── auth.test.js
│       └── models.test.js
├── Dockerfile
├── index.js
└── package.json
docker-compose.test.yml
Jenkinsfile
```

## Running Tests Locally
```bash
# From back/ directory
npm test

# Via Docker (mirrors CI environment)
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

## Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=test
MONGO_URL=mongodb://mongo:27017/mydb_test
JWT_SECRET=supersecretkey
```

## CI Pipeline Flow
```
Push to test branch
→ Jenkins triggers automatically via GitHub webhook
→ Setup Env (inject credentials)
→ Docker builds backend image
→ Runs jest tests inside container
→ Container exits with code 0 (pass) or code 1 (fail)
→ Cleanup
```