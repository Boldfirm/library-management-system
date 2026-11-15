import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GenreFilter({ selectedGenre, onSelectGenre }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios
      .get(`${apiUrl}/genres`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setGenres(list);
      })
      .catch((err) => {
        console.error('Failed to load genres:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full sm:w-56">
      <label htmlFor="genre-filter" className="sr-only">
        Filter by genre
      </label>
      <select
        id="genre-filter"
        value={selectedGenre}
        onChange={(e) => onSelectGenre(e.target.value)}
        disabled={loading}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}