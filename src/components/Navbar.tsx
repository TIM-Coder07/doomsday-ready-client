"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/movies", label: "Movies" },
  { href: "/rewatch-plan", label: "Rewatch Plan" },
  { href: "/booking", label: "Booking" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-red-500">Doomsday</span> Ready
        </Link>
        <ul className="flex gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-red-600 text-white" : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}