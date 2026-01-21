'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Post, Comment } from '@/lib/types';
import CommentTree from '@/components/CommentTree';
import CommentForm from '@/components/CommentForm';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = parseInt(params.id as string);
    const { isAuthenticated } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState<number | null>(null);
    const [localPoints, setLocalPoints] = useState(0);

    useEffect(() => {
        loadPostAndComments();
    }, [postId]);

    const loadPostAndComments = async () => {
        setLoading(true);
        try {
            // In a real app, you'd fetch a single post, but since the API only has list posts,
            // we'll fetch all and find the one we need
            const posts = await api.getPosts('new', 50, 0);
            const foundPost = posts.find(p => p.id === postId);

            if (!foundPost) {
                alert('Post not found');
                router.push('/');
                return;
            }

            setPost(foundPost);
            setLocalPoints(foundPost.points);

            const commentsData = await api.getComments(postId);
            setComments(commentsData);
        } catch (error) {
            console.error('Failed to load post:', error);
            alert('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (value: -1 | 1) => {
        if (!isAuthenticated) {
            alert('Please login to vote');
            return;
        }

        try {
            const newValue = voted === value ? 0 : value;
            await api.votePost(postId, newValue);

            if (voted !== null && newValue === 0) {
                setLocalPoints(prev => prev - voted);
                setVoted(null);
            } else if (voted !== null) {
                setLocalPoints(prev => prev - voted + newValue);
                setVoted(newValue);
            } else {
                setLocalPoints(prev => prev + newValue);
                setVoted(newValue);
            }
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading post...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-8 text-gray-500">
                Post not found
            </div>
        );
    }

    const domain = post.url
        ? new URL(post.url).hostname.replace('www.', '')
        : null;

    const topLevelComments = comments.filter(c => c.parent_id === null);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Post Header */}
            <div className="bg-gray-50 border rounded p-4 mb-6">
                <div className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => handleVote(1)}
                            className={`text-gray-400 hover:text-orange-500 text-xl ${voted === 1 ? 'text-orange-500' : ''}`}
                            disabled={!isAuthenticated}
                        >
                            ▲
                        </button>
                        <span className="text-sm font-medium">{localPoints}</span>
                        <button
                            onClick={() => handleVote(-1)}
                            className={`text-gray-400 hover:text-orange-500 text-xl ${voted === -1 ? 'text-orange-500' : ''}`}
                            disabled={!isAuthenticated}
                        >
                            ▼
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                            <h1 className="text-xl font-semibold">{post.title}</h1>
                            {domain && (
                                <span className="text-sm text-gray-500">
                                    ({domain})
                                </span>
                            )}
                        </div>

                        {post.url && (
                            <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline break-all"
                            >
                                {post.url}
                            </a>
                        )}

                        {post.text && (
                            <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                                {post.text}
                            </p>
                        )}

                        <div className="text-xs text-gray-500 mt-3">
                            by {post.author_name} · {timeAgo(post.created_at)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h2>

                {isAuthenticated ? (
                    <div className="mb-6">
                        <CommentForm
                            postId={postId}
                            onSuccess={loadPostAndComments}
                        />
                    </div>
                ) : (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        Please <button onClick={() => router.push('/login')} className="text-orange-600 hover:underline">login</button> to comment.
                    </div>
                )}

                {topLevelComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {topLevelComments.map((comment) => (
                            <CommentTree
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                onCommentAdded={loadPostAndComments}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}