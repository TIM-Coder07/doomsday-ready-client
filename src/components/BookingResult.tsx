import type { BookingQuote } from "@/types";

export default function BookingResult({ quote }: { quote: BookingQuote }) {
  if (!quote.possible) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-5" role="status">
        <p className="text-lg font-semibold text-red-300">Not possible</p>
        <p className="mt-1 text-sm text-zinc-300">
          {quote.cinema.name} cannot seat exactly {quote.groupSize} people with its bundle sizes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-5" role="status">
      <p className="text-lg font-semibold text-emerald-300">
        {quote.totalBundles} {quote.totalBundles === 1 ? "bundle" : "bundles"} for {quote.groupSize} people
      </p>
      <ul className="mt-3 space-y-1">
        {quote.bundles.map((b) => (
          <li key={b.size} className="flex justify-between rounded-md bg-black/30 px-3 py-2 text-sm">
            <span>Bundle of {b.size}</span>
            <span className="font-semibold">× {b.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}