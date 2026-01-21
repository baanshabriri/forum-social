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
{
    "username": "string",
    "email": "string",
    "password": "string"
}

yaml
Copy code

---

### POST /auth/login

Authenticate a user.

Request body:
{
    "username": "string",
    "password": "string"
}

makefile
Copy code

Response:
{
"access_token": "string",
"token_type": "bearer"
}

yaml
Copy code

---

## Posts

### GET /posts

Fetch posts.

Query parameters:
- sort: string (optional, values: new, top, best)
- limit: integer (optional, default: 20)
- offset: integer (optional, default: 0)

Response:
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
"user_vote": 1,
"created_at": "2024-01-01T12:00:00Z"
}
]

yaml
Copy code

---

### POST /posts

Create a new post.

Authentication required.

Request body:
{
"title": "string",
"url": "string | null",
"text": "string | null"
}

yaml
Copy code

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
{
"post_id": 1,
"points": 42
}

yaml
Copy code

---

## Comments

### GET /comments/posts/{post_id}

Fetch threaded comments for a post.

Response:
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

yaml
Copy code

---

### POST /comments/posts/{post_id}

Add a comment.

Authentication required.

Request body:
{
"content": "string",
"parent_id": null
}

yaml
Copy code

---

### PUT /comments/{comment_id}

Edit a comment.

Authentication required (owner only).

Request body:
{
"content": "string"
}

yaml
Copy code

---

### DELETE /comments/{comment_id}

Delete a comment.

Authentication required (owner only).

---

## Health

### GET /health

Health check endpoint.

Response:
{
"status": "ok"
}