from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from datetime import datetime


class PostCreate(BaseModel):
    title: str = Field(min_length=3, max_length=300)
    url: Optional[HttpUrl] = None
    text: Optional[str] = None

    def validate_content(self):
        if not self.url and not self.text:
            raise ValueError("Either url or text must be provided")


class PostOut(BaseModel):
    id: int
    title: str
    url: Optional[str]
    text: Optional[str]
    points: int
    upvotes: int
    downvotes: int
    author_id: int
    author_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
