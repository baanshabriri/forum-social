'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Post } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PostItemProps {
    post: Post;
    rank?: number;
    onVoteChange?: () => void;
}

export default function PostItem({ post, rank, onVoteChange }: PostItemProps) {
    const { isAuthenticated } = useAuth();
    const [localPoints, setLocalPoints] = useState(post.points);
    const [voted, setVoted] = useState<number | null>(null);

    const handleVote = async (value: -1 | 1) => {
        if (!isAuthenticated) {
            alert('Please login to vote');
            return;
        }

        try {
            // If clicking same vote, remove it (set to 0)
            const newValue = voted === value ? 0 : value;
            await api.votePost(post.id, newValue);

            // Update local state
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

            onVoteChange?.();
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    const domain = post.url
        ? new URL(post.url).hostname.replace('www.', '')
        : null;

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    return (
        <div className="flex gap-2 py-1">
            {rank && (
                <div className="text-gray-500 text-sm w-6 text-right">
                    {rank}.
                </div>
            )}

            <div className="flex flex-col items-center gap-1 pt-1">
                <button
                    onClick={() => handleVote(1)}
                    className={`text-gray-400 hover:text-orange-500 ${voted === 1 ? 'text-orange-500' : ''}`}
                    disabled={!isAuthenticated}
                >
                    ▲
                </button>
                <button
                    onClick={() => handleVote(-1)}
                    className={`text-gray-400 hover:text-orange-500 ${voted === -1 ? 'text-orange-500' : ''}`}
                    disabled={!isAuthenticated}
                >
                    ▼
                </button>
            </div>

            <div className="flex-1">
                <div className="flex items-baseline gap-2">
                    {post.url ? (
                        <>
                            <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-gray-700 font-medium"
                            >
                                {post.title}
                            </a>
                            {domain && (
                                <span className="text-xs text-gray-500">
                                    ({domain})
                                </span>
                            )}
                        </>
                    ) : (
                        <Link
                            href={`/post/${post.id}`}
                            className="text-black hover:text-gray-700 font-medium"
                        >
                            {post.title}
                        </Link>
                    )}
                </div>

                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                    <span>{localPoints} points by {post.author_name}</span>
                    <span>{timeAgo(post.created_at)}</span>
                    <span>|</span>
                    <Link
                        href={`/post/${post.id}`}
                        className="underline hover:text-orange-500"
                    >
                        {post.comment_count} comments
                    </Link>
                </div>
            </div>
        </div>
    );
}