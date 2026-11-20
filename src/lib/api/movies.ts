import { api } from "./axios";
import type { Movie, MovieInput, RewatchPlan } from "@/types";

export async function getMovies(): Promise<Movie[]> {
  const { data } = await api.get<Movie[]>("/movies");
  return data;
}

export async function createMovie(input: MovieInput): Promise<Movie> {
  const { data } = await api.post<Movie>("/movies", input);
  return data;
}

export async function updateMovie(
  id: string,
  changes: Partial<MovieInput> & { watched?: boolean }
): Promise<Movie> {
  const { data } = await api.patch<Movie>(`/movies/${id}`, changes);
  return data;
}

export async function getRewatchPlan(id: string): Promise<RewatchPlan> {
  const { data } = await api.get<RewatchPlan>(`/movies/${id}/rewatch-order`);
  return data;
}