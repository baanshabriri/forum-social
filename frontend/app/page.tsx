// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Post, SortType } from '@/lib/types';
import PostItem from '@/components/PostItem';

export default function Home() {
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortType) || 'new';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    loadPosts(true);
  }, [sort]);

  const loadPosts = async (reset = false) => {
    setLoading(true);
    try {
      const newOffset = reset ? 0 : offset;
      const data = await api.getPosts(sort, limit, newOffset);

      if (reset) {
        setPosts(data);
        setOffset(limit);
      } else {
        setPosts([...posts, ...data]);
        setOffset(offset + limit);
      }

      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    loadPosts(false);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading posts...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-4 text-sm border-b pb-2">
        <span className="font-medium text-gray-700">
          Sorted by: <span className="text-orange-500">{sort}</span>
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts yet. Be the first to submit!
        </div>
      ) : (
        <div className="divide-y-0 divide-amber-600">
          {posts.map((post, index) => (
            <PostItem
              key={post.id}
              post={post}
              rank={index + 1}
              onVoteChange={() => loadPosts(true)}
            />
          ))}
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}