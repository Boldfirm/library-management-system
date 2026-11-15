import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {book.genre?.name || 'General'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isAvailable
              ? `${book.availableCopies} of ${book.totalCopies} available`
              : 'Checked out'}
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition line-clamp-2">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">by {book.author}</p>
        <p className="mt-3 text-xs text-slate-400 font-mono">ISBN: {book.isbn}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/books/${book.id}`}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
        >
          View Details <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}