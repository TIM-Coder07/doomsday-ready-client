import Link from "next/link";

const views = [
  { href: "/movies", title: "Movies", text: "Add movies, set what to watch first, and tick what you have seen." },
  { href: "/rewatch-plan", title: "Rewatch Plan", text: "See every movie to catch up on, in order, with your progress." },
  { href: "/booking", title: "Booking", text: "Get the fewest seat bundles for your opening-night watch party." },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="pt-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">Avengers: Doomsday is coming</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Get ready for opening night.</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Plan your MCU rewatch in the right order and book seats for the whole group without paying for an empty one.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {views.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-red-500/60 hover:bg-white/10"
          >
            <h2 className="text-lg font-semibold">{v.title} →</h2>
            <p className="mt-2 text-sm text-zinc-400">{v.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}