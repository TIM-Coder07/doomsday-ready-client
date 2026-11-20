import { api } from "./axios";
import type { BookingQuote, Cinema, CinemaInput } from "@/types";

export async function getCinemas(): Promise<Cinema[]> {
  const { data } = await api.get<Cinema[]>("/cinemas");
  return data;
}

export async function createCinema(input: CinemaInput): Promise<Cinema> {
  const { data } = await api.post<Cinema>("/cinemas", input);
  return data;
}

export async function getBookingQuote(cinemaId: string, groupSize: number): Promise<BookingQuote> {
  const { data } = await api.get<BookingQuote>(`/cinemas/${cinemaId}/booking`, {
    params: { groupSize },
  });
  return data;
}