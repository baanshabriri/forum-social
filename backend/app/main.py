from fastapi import FastAPI
from app.api.v1.routes import auth, post
from app.models import User, Post, Comment, Vote

app = FastAPI(
    title="Hacker News Clone API",
    version="0.1.0"
)


@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(auth.router)
app.include_router(post.router)

