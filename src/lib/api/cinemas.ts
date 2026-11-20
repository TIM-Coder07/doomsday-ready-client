import { api } from "./axios";
import type { BookingQuote, Cinema, NewCinema } from "@/types";

export async function getCinemas(): Promise<Cinema[]> {
  const { data } = await api.get<Cinema[]>("/cinemas");
  return data;
}

export async function createCinema(cinema: NewCinema): Promise<Cinema> {
  const { data } = await api.post<Cinema>("/cinemas", cinema);
  return data;
}

export async function getBookingQuote(id: string, groupSize: number): Promise<BookingQuote> {
  const { data } = await api.get<BookingQuote>(`/cinemas/${id}/booking`, { params: { groupSize } });
  return data;
}