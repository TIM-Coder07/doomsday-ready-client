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
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/movies" className="text-lg font-bold text-zinc-900">
          Doomsday Ready
        </Link>

        <ul className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
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