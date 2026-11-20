"use client";

import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getMovies, getRewatchPlan, updateMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import type { Movie, RewatchPlan } from "@/types";

// 125 -> "2h 5m", 45 -> "45m", 120 -> "2h"
function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

export default function RewatchPlanPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [plan, setPlan] = useState<RewatchPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getMovies()
      .then((data) => {
        if (!ignore) setMovies(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoadingMovies(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function loadPlan(id: string) {
    setTargetId(id);
    setError("");

    if (!id) {
      setPlan(null);
      return;
    }

    setLoadingPlan(true);
    try {
      setPlan(await getRewatchPlan(id));
    } catch (err) {
      setPlan(null);
      setError(getErrorMessage(err));
    } finally {
      setLoadingPlan(false);
    }
  }

  async function toggleWatched(movie: Movie) {
    setError("");
    try {
      await updateMovie(movie._id, { watched: !movie.watched });
      setPlan(await getRewatchPlan(targetId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rewatch Plan</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Pick the movie you want to be ready for and see what to watch first, in order.
        </p>
      </div>

      <label className="block text-sm font-medium">
        Target movie
        <select
          value={targetId}
          disabled={loadingMovies}
          onChange={(event) => loadPlan(event.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        >
          <option value="">{loadingMovies ? "Loading movies..." : "Choose a movie"}</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
      </label>

      {!loadingMovies && movies.length === 0 && !error && (
        <p className="text-sm text-zinc-500">No movies yet. Add some on the Movies page first.</p>
      )}

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loadingPlan && <p className="text-sm text-zinc-500">Building your plan...</p>}

      {plan && !loadingPlan && plan.totalCount === 0 && (
        <p className="rounded-lg border border-zinc-200 bg-white p-5 text-sm">
          Nothing to watch first. You are ready for <strong>{plan.target.title}</strong>.
        </p>
      )}

      {plan && !loadingPlan && plan.totalCount > 0 && (
        <div className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5">
          <ProgressBar watched={plan.watchedCount} total={plan.totalCount} />

          <p className="text-sm">
            Remaining watch time:{" "}
            <strong>
              {plan.remainingRuntime === 0 ? "none, all caught up" : formatMinutes(plan.remainingRuntime)}
            </strong>
          </p>

          <ol className="space-y-2">
            {plan.order.map((movie, index) => (
              <li
                key={movie._id}
                className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${movie.watched ? "text-zinc-400 line-through" : ""}`}>
                      {movie.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {movie.releaseYear} · {formatMinutes(movie.runtime)}
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={movie.watched} onChange={() => toggleWatched(movie)} />
                  Watched
                </label>
              </li>
            ))}
          </ol>

          <p className="text-sm text-zinc-600">
            Then watch <strong>{plan.target.title}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}