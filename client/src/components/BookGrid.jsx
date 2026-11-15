import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BookCard from './BookCard.jsx';

function BookSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-24 bg-slate-200 rounded-full" />
        <div className="h-5 w-20 bg-slate-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
      <div className="h-3 w-32 bg-slate-100 rounded mb-6" />
      <div className="pt-4 border-t border-slate-100">
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export default function BookGrid({ genreId, search, sortBy = 'title' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const params = { limit: 50 };
    if (genreId) params.genreId = genreId;
    if (search) params.search = search;

    axios
      .get(`${apiUrl}/books`, { params })
      .then((res) => {
        if (!isCancelled) {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setBooks(list);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load books from the library server. Please verify the API is running.'
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [genreId, search]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    if (sortBy === 'author') {
      copy.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [books, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
        {Array.from({ length: 6 }).map((_, idx) => (
          <BookSkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <h3 className="text-base font-semibold text-rose-800">Failed to Load Catalog</h3>
        <p className="mt-1 text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (sortedBooks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">No books match your filters</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try clearing your search query or switching back to All Genres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}