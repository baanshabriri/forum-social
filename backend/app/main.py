from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import auth, post, comment
from app.models import User, Post, Comment, Vote

app = FastAPI(
    title="Hacker News Clone API",
    version="0.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # local frontend
        "http://frontend:3000",       # docker service name
    ],
    allow_credentials=True,
    allow_methods=["*"],             # IMPORTANT (allows OPTIONS)
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(auth.router)
app.include_router(post.router)
app.include_router(comment.router)
