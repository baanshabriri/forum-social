from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.limiter import rate_limit
from app.api.deps import get_current_user
from app.models import User, Post, Vote, Comment
from app.schemas.post import PostCreate, PostOut
from app.services.post import get_posts_data

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostOut)
@rate_limit(action="post", limit=10, window_seconds=20 * 60)
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
    return PostOut(
        id=post.id,
        author_id=post.author_id,
        author_name=user.username,
        title=post.title,        
        points=post.points,
        text=post.text,
        url=post.url,
        upvotes=0,
        downvotes=0,
        comment_count=0,
        created_at=post.created_at
    )


@router.get("/", response_model=list[PostOut])
async def list_posts(
    sort: str = Query("new", enum=["new", "top", "best"]),
    limit: int = Query(20, le=50),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    posts = await get_posts_data(sort=sort,limit=limit, offset=offset, post_ids=[], db=db)
    return posts


@router.post("/{post_id}/vote")
@rate_limit(action="vote", limit=5, window_seconds=1 * 60)
async def vote_post(
    post_id: int,
    value: int = Query(..., ge=-1, le=1),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
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

    if value == 0:
        if vote:
            post.points -= vote.value
            await db.delete(vote)
            await db.commit()
        return {"post_id": post_id, "points": post.points}

    if vote:
        if vote.value == value:
            # idempotent: same vote again
            return {"post_id": post_id, "points": post.points}
        post.points -= vote.value
        vote.value = value
    else:
        vote = Vote(user_id=user.id, post_id=post_id, value=value)
        db.add(vote)

    post.points += value
    await db.commit()

    return {"post_id": post_id, "points": post.points}


@router.get("/search", response_model=list[PostOut])
async def search_posts(
    q: str = Query(..., min_length=1),
    sort: str = Query("new", enum=["new", "top", "best"]),
    limit: int = Query(20, le=50),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    id_stmt = (
        select(Post.id)
        .where(Post.title.ilike(f"%{q}%"))
        .order_by(Post.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(id_stmt)
    post_ids = result.scalars().all()
    if len(post_ids) == 0:
        return []
    posts = await get_posts_data(sort=sort, limit=limit, offset=offset, post_ids=post_ids, db=db)
    
    return posts
