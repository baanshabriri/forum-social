'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function SubmitPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [postType, setPostType] = useState<'url' | 'text'>('url');
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                    <p className="text-gray-700">Please login to submit posts.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        if (postType === 'url' && !url.trim()) {
            alert('Please enter a URL');
            return;
        }

        if (postType === 'text' && !text.trim()) {
            alert('Please enter some text');
            return;
        }

        setLoading(true);
        try {
            const postData = {
                title: title.trim(),
                url: postType === 'url' ? url.trim() : null,
                text: postType === 'text' ? text.trim() : null,
            };

            const newPost = await api.createPost(postData);
            router.push(`/post/${newPost.id}`);
        } catch (error) {
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Submit a New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter post title"
                        minLength={3}
                        maxLength={300}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Post Type
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="url"
                                checked={postType === 'url'}
                                onChange={(e) => setPostType(e.target.value as 'url' | 'text')}
                                className="mr-2"
                            />
                            URL
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="text"
                                checked={postType === 'text'}
                                onChange={(e) => setPostType(e.target.value as 'url' | 'text')}
                                className="mr-2"
                            />
                            Text
                        </label>
                    </div>
                </div>

                {postType === 'url' ? (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            URL *
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="https://example.com"
                            required={postType === 'url'}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Text *
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Write your post content..."
                            rows={10}
                            required={postType === 'text'}
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}