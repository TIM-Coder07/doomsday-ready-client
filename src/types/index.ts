export type Movie = {
  _id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: string[];
  watched: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewMovie = {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites?: string[];
  watched?: boolean;
};

export type MovieUpdate = Partial<NewMovie>;

export type RewatchOrder = {
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
  createdAt: string;
  updatedAt: string;
};

export type NewCinema = {
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

// Shape of every error the API sends back
export type ApiErrorBody = {
  error: { code: string; message: string };
};