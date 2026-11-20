import { api } from "./axios";
import type { Movie, MovieUpdate, NewMovie, RewatchOrder } from "@/types";

export async function getMovies(): Promise<Movie[]> {
  const { data } = await api.get<Movie[]>("/movies");
  return data;
}

export async function createMovie(movie: NewMovie): Promise<Movie> {
  const { data } = await api.post<Movie>("/movies", movie);
  return data;
}

export async function updateMovie(id: string, changes: MovieUpdate): Promise<Movie> {
  const { data } = await api.patch<Movie>(`/movies/${id}`, changes);
  return data;
}

export async function getRewatchOrder(id: string): Promise<RewatchOrder> {
  const { data } = await api.get<RewatchOrder>(`/movies/${id}/rewatch-order`);
  return data;
}