from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)
    parent_id: Optional[int] = None


class CommentUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class CommentOut(BaseModel):
    id: int
    content: str
    author_id: int
    author_name: str
    post_id: int
    parent_id: Optional[int]
    created_at: datetime
    children: List["CommentOut"] = []

    class Config:
        from_attributes = True


CommentOut.model_rebuild()
