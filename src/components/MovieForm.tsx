"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMovie } from "@/lib/api/movies";
import { getErrorMessage } from "@/lib/api/axios";
import type { Movie } from "@/types";
import PrerequisitePicker from "./PrerequisitePicker";

// Same rules as the API, so most mistakes are caught before sending
const movieFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  releaseYear: z
    .number({ error: "Enter a release year" })
    .int("Use a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier"),
  runtime: z
    .number({ error: "Enter a runtime" })
    .int("Use a whole number")
    .min(1, "Runtime must be 1 to 300 minutes")
    .max(300, "Runtime must be 1 to 300 minutes"),
  prerequisites: z.array(z.string()),
  watched: z.boolean(),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

// NaN shows as an empty number box, so both number fields clear after each add
const emptyForm: MovieFormValues = { title: "", releaseYear: NaN, runtime: NaN, prerequisites: [], watched: false };

type Props = {
  movies: Movie[];
  onCreated: (movie: Movie) => void;
};

const inputClass =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-red-500";

export default function MovieForm({ movies, onCreated }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: emptyForm,
  });

  async function onSubmit(values: MovieFormValues) {
    setServerError(null);
    try {
      const movie = await createMovie(values);
      onCreated(movie);
      reset(emptyForm);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5" noValidate>
      <h2 className="text-lg font-semibold">Add a movie</h2>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm text-zinc-300">Title</label>
          <input id="title" className={inputClass} placeholder="Iron Man" {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="releaseYear" className="mb-1 block text-sm text-zinc-300">Release year</label>
          <input
            id="releaseYear"
            type="number"
            className={inputClass}
            placeholder="2008"
            {...register("releaseYear", { valueAsNumber: true })}
          />
          {errors.releaseYear && <p className="mt-1 text-xs text-red-400">{errors.releaseYear.message}</p>}
        </div>
        <div>
          <label htmlFor="runtime" className="mb-1 block text-sm text-zinc-300">Runtime (min)</label>
          <input
            id="runtime"
            type="number"
            className={inputClass}
            placeholder="126"
            {...register("runtime", { valueAsNumber: true })}
          />
          {errors.runtime && <p className="mt-1 text-xs text-red-400">{errors.runtime.message}</p>}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm text-zinc-300">Watch these first (optional)</p>
        <Controller
          control={control}
          name="prerequisites"
          render={({ field }) => (
            <PrerequisitePicker movies={movies} selected={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-red-600" {...register("watched")} />
        Already watched
      </label>

      {serverError && <p className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-300">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add movie"}
      </button>
    </form>
  );
}