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
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (!isSearching) {
      loadPosts(true);
    }
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

  const searchPosts = async () => {
    if (!query.trim()) {
      // empty search → go back to feed
      setIsSearching(false);
      loadPosts(true);
      return;
    }

    setLoading(true);
    setIsSearching(true);

    try {
      const data = await api.searchPosts(query.trim());
      setPosts(data);
      setHasMore(false); // no pagination for search (for now)
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="flex items-end justify-between border-b border-gray-300/60 pb-2 text-sm">
        {/* Left: Search */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-500">search:</span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchPosts()}
            className="border-b border-gray-300 bg-transparent px-1 text-sm focus:outline-none focus:border-orange-500"
            placeholder="search titles"
          />

          <button
            type="button"
            onClick={searchPosts}
            className="rounded text-gray-500 hover:text-orange-500"
            aria-label="Submit search"
          >
            🔍
          </button>
        </div>

        {/* Right: Sort */}
        <span className="font-medium text-gray-500">
          sorted by: <span className="text-orange-500">{sort}</span>
        </span>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts found.
        </div>
      ) : (
        <div>
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

      {/* Load more (disabled during search) */}
      {hasMore && posts.length > 0 && !isSearching && (
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