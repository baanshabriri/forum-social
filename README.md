# 4umSocial

A full-stack Hacker News style application built with FastAPI, PostgreSQL, Next.js, and Docker Compose.

The project supports authentication, post submission, voting, nested comments, search posts, rate limiting, and a modern frontend. It is designed to be async-safe and easy to extend. It's not production-ready yet.

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy 2.0 (async)
- PostgreSQL
- Alembic
- JWT authentication
- Sliding-window rate limiting

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Infrastructure
- Docker
- Docker Compose
- GitHub Actions (CI)

---

## Setup Instructions

This section explains how to run the project locally **without Docker**, using native installations.

---

### Prerequisites

You must have the following installed:

#### Backend
- Python 3.12
- PostgreSQL 16+
- pip3

#### Frontend
- Node.js 20
- npm

---

## Backend Setup (FastAPI)

### 1. Create a virtual environment

From the `backend/` directory:
```
python3 -m venv .venv
source .venv/bin/activate
```
---

### 2. Install dependencies

```
pip3 install --upgrade pip
pip3 install -r requirements.txt
```
---

### 3. Create the database

Login to PostgreSQL:
```
psql -U postgres
```
Create user and database:
```
CREATE USER hn_user WITH PASSWORD 'hn_pass';
CREATE DATABASE hn_db OWNER hn_user;
\q;
```

---

### 4. Configure environment variables

Create a `.env` file inside `backend/`:

```
DATABASE_URL=postgresql+asyncpg://hn_user:hn_pass@db:5432/hn_db
SECRET_KEY=super-secret-change-me
POSTGRES_DB=hn_db
POSTGRES_USER=hn_user
POSTGRES_PASSWORD=hn_pass
POSTGRES_HOST=db
```
---

### 5. Run database migrations
```
alembic upgrade head
```
---

### 6. Start the backend server
```
uvicorn app.main:app --reload
```

Backend will be available at:
- http://localhost:8000
- Swagger docs: http://localhost:8000/docs

---

## Frontend Setup (Next.js)

### 1. Install dependencies

From the `frontend/` directory:
```
npm install
```
---

### 2. Configure environment variables

Create a `.env.local` file in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
---

### 3. Start the frontend
```
npm run dev
```
Frontend will be available at:
- http://localhost:3000

---

## Verifying the Setup

1. Visit http://localhost:3000
2. Sign up a new user
3. Submit a post
4. Vote and comment to verify full functionality

---

## Notes

- The backend must be running before the frontend
- PostgreSQL must be running locally
- Docker is recommended

---
## Setup Instructions Docker

### Prerequisites
- Docker
- Docker Compose

### Clone the repository
```
git clone git@github.com:baanshabriri/forum-social.git
cd forum-social
```

### Start the application
```
docker compose up -d --build
```

### Services
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432

---

## Environment Variables

Create a `.env` file in the project root:

DATABASE_URL=postgresql+asyncpg://hn_user:hn_pass@db:5432/hn_db
SECRET_KEY=super-secret-change-me
POSTGRES_DB=hn_db
POSTGRES_USER=hn_user
POSTGRES_PASSWORD=hn_pass
POSTGRES_HOST=db

### Environment Variable Reference

|      Variable     |           Description        |
|-------------------|------------------------------|
| DATABASE_URL      | PostgreSQL connection string |
| SECRET_KEY        | JWT signing secret           |
| POSTGRES_DB       | Postgres DB name             |
| POSTGRES_USER     | Postgres DB user name        |
| POSTGRES_PASSWORD | Postgres DB user password    |
| POSTGRES_HOST     | Postgres DB host (db for docker)|
| NEXT_PUBLIC_API_URL | Backend API URL (frontend) |

---

## API Documentation

See `API.md` or Swagger API Docs: http://localhost:8000/docs
for full backend API documentation.

---

## Features Implemented

- User signup and login
- Post submission (URL or text)
- Post feed (sort by new / top / best)
- Post search by title
- Upvote, downvote, unvote
- Threaded comments
- Rate limiting
- Vote state persistence
- Dockerized full stack

---

## Future Improvements

- Comment voting
- User profiles
- Notifications
- Redis-backed rate limiting
- Production deployment

---

## AI Tools Used

- ChatGPT
- GitHub Copilot

---

## How AI Assisted Development

AI tools were used as development assistants, not autonomous code generators.

They helped with:
- Debugging async SQLAlchemy issues
- Frontend/backend contract alignment
- Frontend styling and boilerplate setup      
- Rate-limiting decorator design
- Docker Compose setup and debugging 
- CI configuration
- Documentation drafting

All final decisions, architecture, and code were reviewed and implemented manually.

---

## License

MIT
