from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.post import Post
from app.models.vote import Vote
from app.schemas.post import PostCreate, PostOut
from app.models.user import User

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostOut)
async def create_post(
    payload: PostCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not payload.url and not payload.text:
        raise HTTPException(status_code=400, detail="url or text required")

    post = Post(
        title=payload.title,
        url=str(payload.url) if payload.url else None,
        text=payload.text,
        author_id=user.id,
    )

    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


@router.get("/", response_model=list[PostOut])
async def list_posts(
    sort: str = Query("new", enum=["new", "top", "best"]),
    limit: int = Query(20, le=50),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Post).outerjoin(Vote)

    if sort == "new":
        stmt = stmt.order_by(Post.created_at.desc())

    elif sort == "top":
        stmt = stmt.order_by(Post.points.desc())

    elif sort == "best":
        stmt = stmt.order_by(
            (Post.points / func.extract("epoch", func.now() - Post.created_at)).desc()
        )

    stmt = stmt.limit(limit).offset(offset)

    result = await db.execute(stmt)
    return result.scalars().all()



@router.post("/{post_id}/vote")
async def vote_post(
    post_id: int,
    value: int = Query(..., ge=-1, le=1),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if value == 0:
        raise HTTPException(status_code=400, detail="Invalid vote")

    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    result = await db.execute(
        select(Vote).where(
            Vote.user_id == user.id,
            Vote.post_id == post_id,
        )
    )
    vote = result.scalar_one_or_none()

    if vote:
        post.points -= vote.value
        vote.value = value
    else:
        vote = Vote(user_id=user.id, post_id=post_id, value=value)
        db.add(vote)

    post.points += value
    await db.commit()

    return {"post_id": post_id, "points": post.points}
