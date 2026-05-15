"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const sideLinks = [
  {
    href: "/",
    label: "Current Rack",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="11" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  /*
  {
    href: "/scan",
    label: "Screenshot Scanner",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="14" height="14" rx="2" />
        <circle cx="7" cy="7" r="1.5" />
        <path d="M16 12l-4-4-7 7" />
      </svg>
    ),
  },
  */
  {
    href: "/dictionary",
    label: "Dictionary Checker",
    icon: (
      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 15V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12l-3-2-2 2-2-2-2 2-2-2-3 2z" />
      </svg>
    ),
  },
  {
    href: "/saved",
    label: "Saved Words",
    icon: (
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 16V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14l-6-3-6 3z" />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="10" width="4" height="7" rx="1" />
        <rect x="7" y="5" width="4" height="12" rx="1" />
        <rect x="13" y="1" width="4" height="16" rx="1" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border-default bg-bg-secondary px-4 py-4 shadow-[1px_0_0_rgba(255,255,255,0.02)] md:flex">
      <div className="border-b border-border-subtle px-2 pb-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Rack Editor
        </h2>
        <p className="text-sm text-text-secondary">Enter letters to solve</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sideLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-4 rounded-sm px-2 py-4 text-sm no-underline transition-all ${
                isActive
                  ? "border border-[rgba(88,101,242,0.2)] bg-accent-indigo-bg text-accent-indigo-light"
                  : "text-text-secondary hover:bg-[rgba(255,255,255,0.03)] hover:text-text-primary"
              }`}
            >
              <span className={isActive ? "text-accent-indigo-light" : "text-text-secondary"}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle pt-6">
        <Link
          href="/guide"
          className="flex w-full items-center justify-center gap-2 border border-border-default bg-transparent px-4 py-2 text-[11px] font-bold uppercase tracking-[0.88px] text-text-primary no-underline transition-colors hover:bg-bg-tile"
        >
          How to Play
        </Link>
      </div>
    </aside>
  );
}
