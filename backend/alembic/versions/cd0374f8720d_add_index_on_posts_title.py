"""add index on posts title

Revision ID: cd0374f8720d
Revises: d4fa3d4ad316
Create Date: 2026-01-22 01:17:57.208666

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cd0374f8720d'
down_revision: Union[str, Sequence[str], None] = 'd4fa3d4ad316'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_posts_title_lower "
        "ON posts (LOWER(title))"
    )

def downgrade() -> None:
    op.execute(
        "DROP INDEX IF EXISTS idx_posts_title_lower"
    )