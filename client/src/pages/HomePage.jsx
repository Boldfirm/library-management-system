import { useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import BookGrid from '../components/BookGrid.jsx';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Library Book Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse available titles, filter by genre, or search live by title and author.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar onSearch={handleSearch} />
        <GenreFilter selectedGenre={genreId} onSelectGenre={setGenreId} />
        <div className="w-full sm:w-48">
          <label htmlFor="sort-books" className="sr-only">
            Sort books
          </label>
          <select
            id="sort-books"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="title">Sort: Title (A–Z)</option>
            <option value="author">Sort: Author (A–Z)</option>
          </select>
        </div>
      </div>

      <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
    </section>
  );
}