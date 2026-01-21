# API Documentation

Base URL:
http://localhost:8000

All endpoints return JSON.
Authentication uses Bearer JWT tokens.

---

## Authentication

### POST /auth/signup

Create a new user.

Request body:
```
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```
Response:
```
{
  "access_token": "string",
  "token_type": "bearer"
}
```
---

### POST /auth/login

Authenticate a user.

Request body:
```
{
    "username": "string",
    "password": "string"
}
```
Response:
```
{
    "access_token": "string",
    "token_type": "bearer"
}
```

---

## Posts

### GET /posts

Fetch posts.

Query parameters:
- sort: string (optional, values: new, top, best)
- limit: integer (optional, default: 20)
- offset: integer (optional, default: 0)

Response:
```
[
    {
        "id": 1,
        "title": "Post title",
        "url": "https://example.com",
        "text": null,
        "author_id": 1,
        "author_name": "alice",
        "points": 10,
        "upvotes": 12,
        "downvotes": 2,
        "comments_count": 1,
        "created_at": "2024-01-01T12:00:00Z"
    }
]
```

---

### POST /posts

Create a new post.

Authentication required.

Request body:
```
{
    "title": "string",
    "url": "string | null",
    "text": "string | null"
}
```
Response:
```
{
    "id": 0,
    "title": "string",
    "url": "string",
    "text": "string",
    "points": 0,
    "upvotes": 0,
    "downvotes": 0,
    "comment_count": 0,
    "author_id": 0,
    "author_name": "string",
    "created_at": "2026-01-21T19:26:06.451Z"
}
```
---

### POST /posts/{post_id}/vote

Vote on a post.

Authentication required.

Query parameters:
- value: integer
  - 1 = upvote
  - -1 = downvote
  - 0 = remove vote

Response:
```
{
    "post_id": 1,
    "points": 42
}
```
---

### GET /posts/search

Search posts by **title only** (case-insensitive substring match).

This endpoint does **not** search post content or comments.

---

Request parameters:

- q: string (required)  Search query text. Matches against post titles only.
- limit: integer (optional, default: 20)    
- offset: integer (optional, default: 0)  


---

Example request:

GET /posts/search?q=wow


---

Response:

[
  {
    "id": 6,
    "title": "wow so many posts",
    "url": null,
    "text": "wow so many posts",
    "points": 1,
    "upvotes": 1,
    "downvotes": 0,
    "comment_count": 1,
    "author_id": 2,
    "author_name": "cd",
    "created_at": "2026-01-21T17:49:56.048967Z"
  }
]

---

Notes:

- Search is **case-insensitive**
- Matches are **substring-based**
- Results are ordered by `created_at DESC`
- Pagination is optional and can be added via `limit` and `offset`
- Authentication is **not required**

---
## Comments

### GET /comments/posts/{post_id}

Fetch threaded comments for a post.

Response:
```
[
    {
        "id": 1,
        "content": "Comment text",
        "author_id": 2,
        "author_name": "bob",
        "post_id": 1,
        "parent_id": null,
        "created_at": "2024-01-01T12:00:00Z",
        "children": []
    }
]
```
---

### POST /comments/posts/{post_id}

Add a comment.

Authentication required.

Request body:
```
{
    "content": "string",
    "parent_id": null
}
```
---

### PUT /comments/{comment_id}

Edit a comment.

Authentication required (owner only).
```
Request body:
{
    "content": "string"
}
```
---

### DELETE /comments/{comment_id}

Delete a comment.

Authentication required (owner only).

---

## Health

### GET /health

Health check endpoint.
```
Response:
{
    "status": "ok"
}
```