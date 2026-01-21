import type {
    Token,
    Post,
    Comment,
    PostCreate,
    CommentCreate,
    CommentUpdate,
    UserCreate,
    UserLogin,
    SortType,
    VoteResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Auth endpoints
    async signup(data: UserCreate): Promise<Token> {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
    }

    async login(data: UserLogin): Promise<Token> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    }

    async getMe(): Promise<any> {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: this.getAuthHeader(),
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    }

    // Post endpoints
    async getPosts(sort: SortType = 'new', limit = 20, offset = 0): Promise<Post[]> {
        const res = await fetch(
            `${API_URL}/posts/?sort=${sort}&limit=${limit}&offset=${offset}`
        );
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
    }

    async searchPosts(query: string): Promise<Post[]> {
        const res = await fetch(
            `${API_URL}/posts/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) {
            throw new Error('Search failed');
        }
        return res.json();
    }

    async createPost(data: PostCreate): Promise<Post> {
        const res = await fetch(`${API_URL}/posts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create post');
        return res.json();
    }

    async votePost(postId: number, value: -1 | 0 | 1): Promise<VoteResponse> {
        const res = await fetch(`${API_URL}/posts/${postId}/vote?value=${value}`, {
            method: 'POST',
            headers: this.getAuthHeader(),
        });
        if (!res.ok) throw new Error('Failed to vote');
        return res.json()
    }

    // Comment endpoints
    async getComments(postId: number): Promise<Comment[]> {
        const res = await fetch(`${API_URL}/comments/posts/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
    }

    async addComment(postId: number, data: CommentCreate): Promise<Comment> {
        const res = await fetch(`${API_URL}/comments/posts/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
    }

    async updateComment(commentId: number, data: CommentUpdate): Promise<Comment> {
        const res = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update comment');
        return res.json();
    }
}

export const api = new ApiClient();