"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import BookingResult from "@/components/BookingResult";
import { createCinema, getBookingQuote, getCinemas } from "@/lib/api/cinemas";
import { getErrorMessage } from "@/lib/api/axios";
import type { BookingQuote, Cinema } from "@/types";

const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

export default function BookingPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Booking quote form
  const [cinemaId, setCinemaId] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState("");

  // Add cinema form
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState("");
  const [cinemaError, setCinemaError] = useState("");
  const [savingCinema, setSavingCinema] = useState(false);

  useEffect(() => {
    let ignore = false;

    getCinemas()
      .then((data) => {
        if (!ignore) setCinemas(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoadingCinemas(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const selectedCinema = cinemas.find((cinema) => cinema._id === cinemaId);

  async function handleQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setQuote(null);

    const size = Number(groupSize);
    if (!cinemaId) {
      setError("Choose a cinema first.");
      return;
    }
    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be a whole number from 1 to 10000.");
      return;
    }

    setLoadingQuote(true);
    try {
      setQuote(await getBookingQuote(cinemaId, size));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingQuote(false);
    }
  }

  async function handleAddCinema(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCinemaError("");

    // "2, 5" -> [2, 5]
    const bundleSizes = sizes
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .map(Number);

    if (bundleSizes.length === 0 || bundleSizes.some((size) => !Number.isInteger(size))) {
      setCinemaError("Enter bundle sizes as whole numbers separated by commas, for example 2, 5.");
      return;
    }

    setSavingCinema(true);
    try {
      const created = await createCinema({ name, bundleSizes });
      setName("");
      setSizes("");
      setCinemaId(created._id);
      setQuote(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setCinemaError(getErrorMessage(err));
    } finally {
      setSavingCinema(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Booking</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Cinemas sell opening night seats only in bundles. Find the fewest bundles that seat your group
          exactly.
        </p>
      </div>

      <form onSubmit={handleQuote} className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Get a quote</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Cinema
            <select
              value={cinemaId}
              disabled={loadingCinemas}
              onChange={(event) => {
                setCinemaId(event.target.value);
                setQuote(null);
                setError("");
              }}
              className={inputClass}
            >
              <option value="">{loadingCinemas ? "Loading cinemas..." : "Choose a cinema"}</option>
              {cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Group size
            <input
              type="number"
              min={1}
              max={10000}
              step={1}
              value={groupSize}
              onChange={(event) => {
                setGroupSize(event.target.value);
                setQuote(null);
              }}
              className={inputClass}
            />
          </label>
        </div>

        {selectedCinema && (
          <p className="mt-3 text-sm text-zinc-600">
            Bundles sold here: {[...selectedCinema.bundleSizes].sort((a, b) => a - b).join(", ")} seats
          </p>
        )}

        {!loadingCinemas && cinemas.length === 0 && !error && (
          <p className="mt-3 text-sm text-zinc-500">No cinemas yet. Add one below.</p>
        )}

        <button
          type="submit"
          disabled={loadingQuote}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loadingQuote ? "Working it out..." : "Find bundles"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {quote && <BookingResult quote={quote} />}

      <form onSubmit={handleAddCinema} className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Add a cinema</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium">
            Bundle sizes
            <input
              type="text"
              required
              placeholder="2, 5"
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-normal text-zinc-500">
              1 to 10 different sizes, each from 1 to 500, separated by commas
            </span>
          </label>
        </div>

        {cinemaError && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {cinemaError}
          </p>
        )}

        <button
          type="submit"
          disabled={savingCinema}
          className="mt-4 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50"
        >
          {savingCinema ? "Adding..." : "Add cinema"}
        </button>
      </form>
    </div>
    
  );
}