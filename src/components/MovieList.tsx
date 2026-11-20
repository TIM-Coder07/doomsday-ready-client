"use client";

import { useState } from "react";
import { updateMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import { formatRuntime } from "@/lib/format";
import type { Movie } from "@/types";
import PrerequisitePicker from "./PrerequisitePicker";

type Props = {
  movies: Movie[];
  onUpdated: (movie: Movie) => void;
};

export default function MovieList({ movies, onUpdated }: Props) {
  if (movies.length === 0) {
    return <p className="text-zinc-400">No movies yet. Add the first one above.</p>;
  }

  const titleById = new Map(movies.map((m) => [m._id, m.title]));

  return (
    <ul className="space-y-3">
      {movies.map((movie) => (
        <MovieRow key={movie._id} movie={movie} movies={movies} titleById={titleById} onUpdated={onUpdated} />
      ))}
    </ul>
  );
}

type RowProps = {
  movie: Movie;
  movies: Movie[];
  titleById: Map<string, string>;
  onUpdated: (movie: Movie) => void;
};

function MovieRow({ movie, movies, titleById, onUpdated }: RowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(movie.prerequisites);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(changes: Partial<Movie>) {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMovie(movie._id, changes);
      onUpdated(updated);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Show the tick right away and undo it if the server says no
  async function toggleWatched(watched: boolean) {
    onUpdated({ ...movie, watched });
    if (!(await save({ watched }))) {
      onUpdated({ ...movie, watched: !watched });
    }
  }

  async function savePrerequisites() {
    if (await save({ prerequisites: draft })) {
      setEditing(false);
    }
  }

  function startEditing() {
    setDraft(movie.prerequisites);
    setError(null);
    setEditing(true);
  }

  return (
    <li className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-red-600"
            checked={movie.watched}
            disabled={saving}
            onChange={(e) => toggleWatched(e.target.checked)}
            aria-label={`Mark ${movie.title} as watched`}
          />
          <span>
            <span className={`font-semibold ${movie.watched ? "text-zinc-400 line-through" : ""}`}>{movie.title}</span>
            <span className="block text-sm text-zinc-400">
              {movie.releaseYear} · {formatRuntime(movie.runtime)}
            </span>
          </span>
        </label>

        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/10"
          >
            Edit prerequisites
          </button>
        )}
      </div>

      {!editing && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="text-zinc-500">Watch first:</span>
          {movie.prerequisites.length === 0 ? (
            <span className="text-zinc-500">none</span>
          ) : (
            movie.prerequisites.map((id) => (
              <span key={id} className="rounded-full bg-white/10 px-2 py-0.5">
                {titleById.get(id) ?? "Unknown movie"}
              </span>
            ))
          )}
        </div>
      )}

      {editing && (
        <div className="mt-3 space-y-3">
          <PrerequisitePicker movies={movies} selected={draft} onChange={setDraft} excludeId={movie._id} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={savePrerequisites}
              disabled={saving}
              className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</p>}
    </li>
  );
}