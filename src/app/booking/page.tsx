"use client";

import { FormEvent, useEffect, useState } from "react";
import BookingResult from "@/components/BookingResult";
import { createCinema, getBookingQuote, getCinemas } from "@/lib/api/cinemas";
import { getErrorMessage } from "@/lib/api/axios";
import type { BookingQuote, Cinema } from "@/types";

const inputClass =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-red-500";

export default function BookingPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [cinemaId, setCinemaId] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCinemas()
      .then((list) => {
        setCinemas(list);
        setCinemaId(list[0]?._id ?? "");
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const selected = cinemas.find((c) => c._id === cinemaId);

  async function handleQuote(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setQuote(null);

    const size = Number(groupSize);
    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be a whole number from 1 to 10,000.");
      return;
    }

    setLoading(true);
    try {
      setQuote(await getBookingQuote(cinemaId, size));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleCinemaCreated(cinema: Cinema) {
    setCinemas((current) => [...current, cinema]);
    setCinemaId(cinema._id);
    setQuote(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Booking</h1>
        <p className="mt-1 text-zinc-400">Find the fewest seat bundles that fit your group exactly.</p>
      </div>

      <form onSubmit={handleQuote} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cinema" className="mb-1 block text-sm text-zinc-300">Cinema</label>
            <select
              id="cinema"
              value={cinemaId}
              onChange={(e) => {
                setCinemaId(e.target.value);
                setQuote(null);
              }}
              className={inputClass}
            >
              {cinemas.length === 0 && <option value="">No cinemas yet</option>}
              {cinemas.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {selected && (
              <p className="mt-1 text-xs text-zinc-400">Bundle sizes: {selected.bundleSizes.join(", ")}</p>
            )}
          </div>
          <div>
            <label htmlFor="groupSize" className="mb-1 block text-sm text-zinc-300">Group size</label>
            <input
              id="groupSize"
              type="number"
              min={1}
              max={10000}
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              placeholder="6"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!cinemaId || loading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Get quote"}
        </button>
      </form>

      {error && <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</p>}
      {quote && <BookingResult quote={quote} />}

      <CinemaForm onCreated={handleCinemaCreated} />
    </div>
  );
}

function CinemaForm({ onCreated }: { onCreated: (cinema: Cinema) => void }) {
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // "2, 5" -> [2, 5]
    const bundleSizes = sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (bundleSizes.length === 0 || bundleSizes.some((n) => !Number.isInteger(n) || n < 1 || n > 500)) {
      setError("Bundle sizes must be whole numbers from 1 to 500, separated by commas.");
      return;
    }

    setSaving(true);
    try {
      onCreated(await createCinema({ name: name.trim(), bundleSizes }));
      setName("");
      setSizes("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 p-5">
      <h2 className="text-lg font-semibold">Add a cinema</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cinemaName" className="mb-1 block text-sm text-zinc-300">Name</label>
          <input id="cinemaName" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Stark Cinema" />
        </div>
        <div>
          <label htmlFor="bundleSizes" className="mb-1 block text-sm text-zinc-300">Bundle sizes</label>
          <input id="bundleSizes" value={sizes} onChange={(e) => setSizes(e.target.value)} className={inputClass} placeholder="2, 5" />
          <p className="mt-1 text-xs text-zinc-500">1 to 10 different sizes, each 1 to 500 seats</p>
        </div>
      </div>
      {error && <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
      >
        {saving ? "Adding..." : "Add cinema"}
      </button>
    </form>
  );
}