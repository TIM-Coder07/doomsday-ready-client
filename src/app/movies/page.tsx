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
  const [error, setError] = useState("");
  // Changing this number makes the list load again
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    getMovies()
      .then((data) => {
        if (ignore) return;
        setMovies(data);
        setError("");
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Movies</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Add movies, set what to watch first, and tick the ones you have seen.
        </p>
      </div>

      <MovieForm movies={movies} onCreated={reload} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">All movies ({movies.length})</h2>

        {loading && <p className="text-sm text-zinc-500">Loading movies...</p>}

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && <MovieList movies={movies} onChanged={reload} />}
      </section>
    </div>
  );
}