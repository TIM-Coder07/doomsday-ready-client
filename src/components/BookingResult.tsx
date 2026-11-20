import type { BookingQuote } from "@/types";

type Props = {
  quote: BookingQuote;
};

export default function BookingResult({ quote }: Props) {
  if (!quote.possible) {
    return (
      <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold text-amber-900">Not possible</h2>
        <p className="mt-1 text-sm text-amber-900">
          {quote.cinema.name} has no combination of bundles that seats exactly {quote.groupSize}{" "}
          {quote.groupSize === 1 ? "person" : "people"}. Try a different group size or another cinema.
        </p>
      </div>
    );
  }

  return (
    <div role="status" className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">
        Buy {quote.totalBundles} {quote.totalBundles === 1 ? "bundle" : "bundles"}
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Exactly {quote.groupSize} {quote.groupSize === 1 ? "seat" : "seats"} at {quote.cinema.name}, no empty
        seats.
      </p>

      <ul className="mt-4 space-y-2">
        {quote.bundles.map((bundle) => (
          <li
            key={bundle.size}
            className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm"
          >
            <span>
              Bundle of <strong>{bundle.size}</strong>
            </span>
            <span className="font-semibold">× {bundle.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}