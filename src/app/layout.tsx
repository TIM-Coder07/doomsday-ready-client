import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doomsday Ready",
  description: "Plan your MCU rewatch and book an opening-night watch party for Avengers: Doomsday.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
          Sample data for a coding challenge, not an official watch guide.
        </footer>
      </body>
    </html>
  );
}