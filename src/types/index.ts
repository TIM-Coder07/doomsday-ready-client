export type Movie = {
  _id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: string[];
  watched: boolean;
};

export type MovieInput = {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites?: string[];
};

export type RewatchPlan = {
  target: { id: string; title: string };
  order: Movie[];
  watchedCount: number;
  totalCount: number;
  remainingRuntime: number;
};

export type Cinema = {
  _id: string;
  name: string;
  bundleSizes: number[];
};

export type CinemaInput = {
  name: string;
  bundleSizes: number[];
};

export type BookingQuote = {
  cinema: { id: string; name: string };
  groupSize: number;
  possible: boolean;
  totalBundles: number;
  bundles: { size: number; count: number }[];
};