'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import CommentForm from '@/components/CommentForm';
import { api } from '@/lib/api';

interface CommentTreeProps {
    comment: Comment;
    postId: number;
    onCommentAdded?: () => void;
}

export default function CommentTree({ comment, postId, onCommentAdded }: CommentTreeProps) {
    const { isAuthenticated, user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [localContent, setLocalContent] = useState(comment.content);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    const handleReplySuccess = () => {
        setShowReplyForm(false);
        onCommentAdded?.();
    };

    const handleEdit = async () => {
        if (!editContent.trim()) return;

        try {
            await api.updateComment(comment.id, { content: editContent });
            setLocalContent(editContent);
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update comment');
        }
    };

    const isOwnComment = user?.id === comment.author_id;

    return (
        <div className="border-l-2 border-gray-200 pl-4 mb-4">
            <div className="text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-700">{comment.author_name}</span>
                {' · '}
                <span>{timeAgo(comment.created_at)}</span>
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            className="text-xs px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditContent(localContent);
                            }}
                            className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">{localContent}</p>

                    <div className="flex gap-3 text-xs text-gray-500">
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="hover:underline"
                            >
                                reply
                            </button>
                        )}
                        {isOwnComment && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="hover:underline"
                            >
                                edit
                            </button>
                        )}
                    </div>
                </>
            )}

            {showReplyForm && (
                <div className="mt-3">
                    <CommentForm
                        postId={postId}
                        parentId={comment.id}
                        onSuccess={handleReplySuccess}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {comment.children && comment.children.length > 0 && (
                <div className="mt-3 space-y-2">
                    {comment.children.map((child) => (
                        <CommentTree
                            key={child.id}
                            comment={child}
                            postId={postId}
                            onCommentAdded={onCommentAdded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}