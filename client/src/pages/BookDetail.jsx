import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios
      .get(`${apiUrl}/books/${id}`)
      .then((res) => {
        if (!isCancelled) {
          setBook(res.data);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err.response?.status === 404
              ? 'Book not found in the catalog.'
              : err.response?.data?.message || 'Unable to fetch book details.'
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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 animate-pulse space-y-4">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-8 w-2/3 bg-slate-200 rounded" />
        <div className="h-5 w-1/3 bg-slate-200 rounded" />
        <div className="h-24 w-full bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h2 className="text-lg font-bold text-rose-800">Book Unavailable</h2>
        <p className="mt-1 text-sm text-rose-600">{error || 'Book record could not be loaded.'}</p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
      >
        &larr; Back to Catalog
      </Link>

      <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {book.genre?.name || 'General'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isAvailable
              ? `${book.availableCopies} of ${book.totalCopies} copies available`
              : 'All copies checked out'}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{book.title}</h1>
        <p className="mt-1 text-lg text-slate-600 font-medium">by {book.author}</p>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-100 py-5 text-sm">
          <div>
            <dt className="text-slate-400 font-medium">ISBN</dt>
            <dd className="mt-1 font-mono font-semibold text-slate-800">{book.isbn}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Total Copies</dt>
            <dd className="mt-1 font-semibold text-slate-800">{book.totalCopies}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Available Copies</dt>
            <dd className="mt-1 font-semibold text-slate-800">{book.availableCopies}</dd>
          </div>
        </dl>

        {Array.isArray(book.reviews) && book.reviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Reader Reviews ({book.reviews.length})
            </h2>
            <ul className="space-y-3">
              {book.reviews.map((rev) => (
                <li
                  key={rev.id}
                  className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-sm"
                >
                  <div className="font-semibold text-amber-600">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}
                  </div>
                  {rev.comment && <p className="mt-1 text-slate-700">{rev.comment}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}