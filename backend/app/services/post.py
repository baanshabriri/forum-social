from fastapi import Depends
from sqlalchemy import select, func, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models import User, Post, Vote, Comment
from app.schemas.post import PostOut

async def get_posts_data_for_search(
        limit: int, 
        offset: int, 
        post_ids: list[int], 
        db: AsyncSession
) -> list[PostOut]:
    
    upvotes = func.coalesce(
        func.sum(case((Vote.value == 1, 1), else_=0)), 0
    ).label("upvotes")

    downvotes = func.coalesce(
        func.sum(case((Vote.value == -1, 1), else_=0)), 0
    ).label("downvotes")

    comment_count_subq = (
        select(
            Comment.post_id,
            func.count(Comment.id).label("comment_count")
        )
        .group_by(Comment.post_id)
        .subquery()
    )

    stmt = (
        select(
            Post,
            upvotes,
            downvotes,
            User.username,
            func.coalesce(comment_count_subq.c.comment_count, 0).label("comment_count")
        )
        .outerjoin(Vote, Vote.post_id == Post.id)        
        .outerjoin(comment_count_subq, comment_count_subq.c.post_id == Post.id)
        .join(User, User.id == Post.author_id)
        
    )
    if len(post_ids) > 0:
        stmt = stmt.where(Post.id.in_(post_ids))
    stmt = stmt.group_by(Post.id, User.username, comment_count_subq.c.comment_count).limit(limit).offset(offset)        
    result = await db.execute(stmt)
    posts = []
    for post, up, down, username, comment_count in result.all():
        posts.append(PostOut(
            id= post.id,
            title=post.title,
            url=post.url,
            text=post.text,
            points=post.points,
            upvotes=up,
            downvotes=down,
            author_id=post.author_id,
            author_name=username,
            created_at=post.created_at,
            comment_count=comment_count
        ))
    return posts
