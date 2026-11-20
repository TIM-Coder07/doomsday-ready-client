"use client";

import { useEffect, useState } from "react";
import MovieForm from "@/components/MovieForm";
import MovieList from "@/components/MovieList";
import { getMovies } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import type { Movie } from "@/types";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(movie: Movie) {
    setMovies((current) => [...current, movie]);
  }

  function handleUpdated(movie: Movie) {
    setMovies((current) => current.map((m) => (m._id === movie._id ? movie : m)));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Movies</h1>
        <p className="mt-1 text-zinc-400">Add movies, set what to watch first, and tick what you have seen.</p>
      </div>

      <MovieForm movies={movies} onCreated={handleCreated} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All movies ({movies.length})</h2>
        {loading && <p className="text-zinc-400">Loading movies...</p>}
        {error && <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</p>}
        {!loading && !error && <MovieList movies={movies} onUpdated={handleUpdated} />}
      </section>
    </div>
  );
}