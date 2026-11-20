"use client";

import { useState } from "react";
import { updateMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import type { Movie } from "@/types";

type Props = {
  movies: Movie[];
  onChanged: () => void;
};

export default function MovieList({ movies, onChanged }: Props) {
  // Id of the movie whose prerequisites are being edited, and the ticked ids
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<{ movieId: string; message: string } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const titleById = new Map(movies.map((movie) => [movie._id, movie.title]));

  function startEditing(movie: Movie) {
    setEditingId(movie._id);
    setSelected(movie.prerequisites);
    setError(null);
  }

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function save(movieId: string, changes: { watched?: boolean; prerequisites?: string[] }) {
    setSavingId(movieId);
    setError(null);
    try {
      await updateMovie(movieId, changes);
      setEditingId(null);
      onChanged();
    } catch (err) {
      setError({ movieId, message: getErrorMessage(err) });
    } finally {
      setSavingId(null);
    }
  }

  if (movies.length === 0) {
    return <p className="text-sm text-zinc-500">No movies yet. Add the first one above.</p>;
  }

  return (
    <ul className="space-y-3">
      {movies.map((movie) => {
        const isEditing = editingId === movie._id;
        const isSaving = savingId === movie._id;
        const others = movies.filter((other) => other._id !== movie._id);

        return (
          <li key={movie._id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-zinc-500">
                  {movie.releaseYear} · {movie.runtime} min
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Watch first:{" "}
                  {movie.prerequisites.length === 0
                    ? "nothing"
                    : movie.prerequisites.map((id) => titleById.get(id) ?? "Unknown").join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={movie.watched}
                    disabled={isSaving}
                    onChange={() => save(movie._id, { watched: !movie.watched })}
                  />
                  Watched
                </label>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => startEditing(movie)}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    Edit prerequisites
                  </button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 border-t border-zinc-200 pt-4">
                {others.length === 0 ? (
                  <p className="text-sm text-zinc-500">No other movies to choose from.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {others.map((other) => (
                      <label key={other._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected.includes(other._id)}
                          onChange={() => toggleSelected(other._id)}
                        />
                        {other.title}
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => save(movie._id, { prerequisites: selected })}
                    className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setError(null);
                    }}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {error?.movieId === movie._id && (
              <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error.message}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}