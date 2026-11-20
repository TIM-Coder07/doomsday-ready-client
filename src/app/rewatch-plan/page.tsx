"use client";

import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getMovies, getRewatchOrder, updateMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import { formatRuntime } from "@/lib/format";
import type { Movie, RewatchOrder } from "@/types";

export default function RewatchPlanPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [targetId, setTargetId] = useState("");
  const [plan, setPlan] = useState<RewatchOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPlan(id: string) {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setPlan(await getRewatchOrder(id));
    } catch (err) {
      setError(getErrorMessage(err));
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }

  function selectTarget(id: string) {
    setTargetId(id);
    loadPlan(id);
  }

  // Load movies once and preselect Avengers: Doomsday when it exists
  useEffect(() => {
    getMovies()
      .then((list) => {
        setMovies(list);
        const doomsday = list.find((m) => m.title.toLowerCase().includes("doomsday"));
        const firstTarget = (doomsday ?? list[list.length - 1])?._id ?? "";
        setTargetId(firstTarget);
        return loadPlan(firstTarget);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  async function toggleWatched(movie: Movie) {
    const watched = !movie.watched;

    // Show the tick right away, then confirm with the server
    setPlan((current) => {
      if (!current) return current;
      const order = current.order.map((m) => (m._id === movie._id ? { ...m, watched } : m));
      return {
        ...current,
        order,
        watchedCount: order.filter((m) => m.watched).length,
        remainingRuntime: order.filter((m) => !m.watched).reduce((sum, m) => sum + m.runtime, 0),
      };
    });

    try {
      await updateMovie(movie._id, { watched });
    } catch (err) {
      setError(getErrorMessage(err));
    }
    await loadPlan(targetId);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Rewatch Plan</h1>
        <p className="mt-1 text-zinc-400">Pick a movie to see everything to watch before it, in order.</p>
      </div>

      <div className="max-w-md">
        <label htmlFor="target" className="mb-1 block text-sm text-zinc-300">Target movie</label>
        <select
          id="target"
          value={targetId}
          onChange={(e) => selectTarget(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-red-500"
        >
          {movies.length === 0 && <option value="">No movies yet</option>}
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</p>}
      {loading && !plan && <p className="text-zinc-400">Loading plan...</p>}

      {plan && (
        <section className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-semibold">Before {plan.target.title}</h2>
            <p className="text-sm text-zinc-300">
              Remaining watch time:{" "}
              <span className="font-semibold text-white">{formatRuntime(plan.remainingRuntime)}</span>
            </p>
          </div>

          <ProgressBar watched={plan.watchedCount} total={plan.totalCount} />

          {plan.order.length === 0 ? (
            <p className="text-zinc-400">Nothing to watch first. You can go straight in.</p>
          ) : (
            <ol className="space-y-2">
              {plan.order.map((movie, index) => (
                <li key={movie._id} className="flex items-center gap-3 rounded-md bg-black/30 px-3 py-2">
                  <span className="w-6 text-right text-sm text-zinc-500">{index + 1}.</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-red-600"
                    checked={movie.watched}
                    disabled={loading}
                    onChange={() => toggleWatched(movie)}
                    aria-label={`Mark ${movie.title} as watched`}
                  />
                  <span className={`flex-1 ${movie.watched ? "text-zinc-500 line-through" : ""}`}>{movie.title}</span>
                  <span className="text-sm text-zinc-400">{formatRuntime(movie.runtime)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  );
}