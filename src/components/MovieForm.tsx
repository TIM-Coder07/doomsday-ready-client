"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import type { Movie } from "@/types";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  releaseYear: z
    .number({ message: "Release year is required" })
    .int("Use a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier"),
  runtime: z
    .number({ message: "Runtime is required" })
    .int("Use a whole number")
    .min(1, "Runtime must be at least 1 minute")
    .max(300, "Runtime must be 300 minutes or less"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  movies: Movie[];
  onCreated: () => void;
};

const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

export default function MovieForm({ movies, onCreated }: Props) {
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function togglePrerequisite(id: string) {
    setPrerequisites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      await createMovie({ ...values, prerequisites });
      reset();
      setPrerequisites([]);
      onCreated();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Add a movie</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium sm:col-span-3">
          Title
          <input type="text" className={inputClass} {...register("title")} />
          {errors.title && <span className="mt-1 block text-xs text-red-600">{errors.title.message}</span>}
        </label>

        <label className="block text-sm font-medium">
          Release year
          <input type="number" className={inputClass} {...register("releaseYear", { valueAsNumber: true })} />
          {errors.releaseYear && (
            <span className="mt-1 block text-xs text-red-600">{errors.releaseYear.message}</span>
          )}
        </label>

        <label className="block text-sm font-medium">
          Runtime (minutes)
          <input type="number" className={inputClass} {...register("runtime", { valueAsNumber: true })} />
          {errors.runtime && <span className="mt-1 block text-xs text-red-600">{errors.runtime.message}</span>}
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Watch these first (optional)</legend>
        {movies.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-500">No other movies yet.</p>
        ) : (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {movies.map((movie) => (
              <label key={movie._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={prerequisites.includes(movie._id)}
                  onChange={() => togglePrerequisite(movie._id)}
                />
                {movie.title}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {serverError && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add movie"}
      </button>
    </form>
  );
}