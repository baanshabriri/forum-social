from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.limiter import rate_limit
from app.api.deps import get_current_user
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
    CommentOut,
)

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/posts/{post_id}", response_model=CommentOut)
@rate_limit(action="comment", limit=10, window_seconds=2 * 60)
async def add_comment(
    post_id: int,
    payload: CommentCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if payload.parent_id:
        parent = await db.get(Comment, payload.parent_id)
        if not parent or parent.post_id != post_id:
            raise HTTPException(status_code=400, detail="Invalid parent comment")

    comment = Comment(
        content=payload.content,
        author_id=user.id,
        post_id=post_id,
        parent_id=payload.parent_id,
    )

    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    return CommentOut(
        id=comment.id,
        content=comment.content,        
        author_id=comment.author_id,
        author_name=user.username,
        post_id=comment.post_id,
        parent_id=comment.parent_id,
        created_at=comment.created_at,
        children=[],
    )


def build_comment_tree(
    comments: list[tuple[Comment, str]]
) -> list[CommentOut]:
    comment_map: dict[int, CommentOut] = {}
    roots: list[CommentOut] = []

    for comment, username in comments:
        comment_map[comment.id] = CommentOut(
            id=comment.id,
            content=comment.content,
            author_id=comment.author_id,
            author_name=username,
            post_id=comment.post_id,
            parent_id=comment.parent_id,
            created_at=comment.created_at,
            children=[],
        )
        
    for comment, _ in comments:
        node = comment_map[comment.id]
        if comment.parent_id:
            parent = comment_map.get(comment.parent_id)
            if parent:
                parent.children.append(node)
        else:
            roots.append(node)

    return roots


@router.get("/posts/{post_id}", response_model=list[CommentOut])
async def get_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(
            Comment,
            User.username.label("username"),
        )
        .where(Comment.post_id == post_id)
        .join(User, User.id == Comment.author_id)
        .order_by(Comment.created_at.asc())
    )
    comments = result.all()
    return build_comment_tree(comments)


@router.put("/{comment_id}", response_model=CommentOut)
@rate_limit(action="update_comment", limit=4, window_seconds=1 * 60)
async def update_comment(
    comment_id: int,
    payload: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    comment = await db.get(Comment, comment_id)
    # comment = await db.execute(
    #     select(Comment)
    #     .join(User, User.id == Comment.author_id)
    # )
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.author_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    comment.content = payload.content
    await db.commit()
    await db.refresh(comment)
    return CommentOut(    
        id=comment.id,
        author_id=comment.author_id,
        author_name=user.username,
        content=comment.content,
        parent_id=comment.parent_id,
        post_id=comment.post_id,
        children=comment.children or [],
        created_at=comment.created_at
    )
