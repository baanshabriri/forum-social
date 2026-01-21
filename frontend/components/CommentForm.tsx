'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface CommentFormProps {
    postId: number;
    parentId?: number | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await api.addComment(postId, {
                content: content.trim(),
                parent_id: parentId || null,
            });
            setContent('');
            onSuccess?.();
        } catch (error) {
            alert('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                maxLength={5000}
                required
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-4 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}