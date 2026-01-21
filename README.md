# 4umSocial

A full-stack Hacker News style application built with FastAPI, PostgreSQL, Next.js, and Docker Compose.

The project supports authentication, post submission, voting, threaded comments, rate limiting, and a modern frontend. It is designed to be async-safe, production-ready, and easy to extend.

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

### Prerequisites
- Docker
- Docker Compose

### Clone the repository
git clone git@github.com:baanshabriri/forum-social.git
cd forum-social

### Start the application
docker compose up -d --build

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

## Dependencies

### Backend
- fastapi
- sqlalchemy
- asyncpg
- alembic
- passlib[bcrypt]
- python-jose
- pydantic

### Frontend
- next
- react
- typescript
- tailwindcss

All dependencies are installed automatically via Docker.

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
- CI configuration
- Documentation drafting

All final decisions, architecture, and code were reviewed and implemented manually.

---

## API Documentation

See `API.md` for full backend API documentation.

---

## Features Implemented

- User signup and login
- Post submission (URL or text)
- Post feed (new / top / best)
- Upvote, downvote, unvote
- Threaded comments
- Rate limiting
- Vote state persistence
- Dockerized full stack
- CI for backend, frontend, and Docker builds

---

## Future Improvements

- Comment voting
- User profiles
- Search
- Notifications
- Redis-backed rate limiting
- Production deployment

---

## License

MIT