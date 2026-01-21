export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface Post {
    id: number;
    title: string;
    url: string | null;
    text: string | null;
    points: number;
    upvotes: number;
    downvotes: number;
    author_id: number;
    created_at: string;
}

export interface Comment {
    id: number;
    content: string;
    author_id: number;
    post_id: number;
    parent_id: number | null;
    created_at: string;
    children: Comment[];
}

export interface PostCreate {
    title: string;
    url?: string | null;
    text?: string | null;
}

export interface CommentCreate {
    content: string;
    parent_id?: number | null;
}

export interface CommentUpdate {
    content: string;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export type SortType = 'new' | 'top' | 'best';