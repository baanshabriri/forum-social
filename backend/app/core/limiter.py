from functools import wraps
from typing import Callable

from app.utils.rate_limiter import SlidingWindowRateLimiter


def rate_limit(
    *,
    action: str,
    limit: int,
    window_seconds: int,
):
    """
    Requires:
      - user OR current_user kwarg with `.id`
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("user") or kwargs.get("current_user")

            if current_user is None:
                raise RuntimeError(
                    "rate_limit decorator requires 'user' or 'current_user'"
                )

            key = f"{action}:{current_user.id}"
            rate_limiter = SlidingWindowRateLimiter()
            await rate_limiter.allow(
                key=key,
                limit=limit,
                window_seconds=window_seconds,
            )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
