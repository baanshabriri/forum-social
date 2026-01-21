# models/vote.py
from sqlalchemy import ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("user_id", "post_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    value: Mapped[int] = mapped_column(Integer)  # +1 or -1

    user = relationship("User", back_populates="votes")
    post = relationship("Post", back_populates="votes")

