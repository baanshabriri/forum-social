import time
import asyncio
from collections import defaultdict, deque
from fastapi import HTTPException, status


class SlidingWindowRateLimiter:
    def __init__(self):
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def allow(
        self,
        key: str,
        limit: int,
        window_seconds: int,
    ) -> None:
        """
        Raises HTTPException if rate limit exceeded.
        """
        now = time.time()

        async with self._lock:
            q = self._events[key]
            
            while q and q[0] <= now - window_seconds:
                q.popleft()

            if len(q) >= limit:
                retry_after = int(q[0] + window_seconds - now)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded",
                    headers={
                        "Retry-After": str(max(retry_after, 1))
                    },
                )

            q.append(now)
