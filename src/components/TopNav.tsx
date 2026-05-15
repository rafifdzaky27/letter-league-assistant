"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Solver" },
    { href: "/dictionary", label: "Dictionary Checker" },
    { href: "/guide", label: "How to Play" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border-default bg-bg-primary px-8 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-accent-indigo-light no-underline"
      >
        Letter League Solver
      </Link>

      {/* Nav Links - hidden on mobile */}
      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => {
          const isActive = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xl font-semibold no-underline transition-colors ${
                isActive
                  ? "border-b-2 border-accent-indigo-light pb-1.5 text-accent-indigo-light opacity-80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right-side actions */}
      <div className="hidden items-center gap-2 md:flex">
        <span className="rounded-sm border border-[rgba(190,194,255,0.3)] bg-accent-indigo-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.88px] text-accent-indigo-light">
          Mode Toggle
        </span>
        <button
          className="p-2 text-text-secondary hover:text-text-primary"
          aria-label="Settings"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10" cy="10" r="3" />
            <path d="M10 1v2m0 14v2m-9-9h2m14 0h2M3.5 3.5l1.4 1.4m10.2 10.2l1.4 1.4M3.5 16.5l1.4-1.4M16.5 3.5l-1.4 1.4" />
          </svg>
        </button>
        <button
          className="p-2 text-text-secondary hover:text-text-primary"
          aria-label="Help"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10" cy="10" r="9" />
            <path d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M10 14.5h.01" />
          </svg>
        </button>
      </div>

      {/* Mobile hamburger */}
      <button className="p-2 text-text-secondary md:hidden" aria-label="Menu">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </header>
  );
}
