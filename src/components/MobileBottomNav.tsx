"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Solver",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="12" y="2" width="6" height="6" rx="1" />
        <rect x="2" y="12" width="6" height="6" rx="1" />
        <rect x="12" y="12" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  /*
  {
    href: "/scan",
    label: "Scan",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <circle cx="8" cy="8" r="1.5" />
        <path d="M17 13l-4-4-7 7" />
      </svg>
    ),
  },
  */
  {
    href: "/dictionary",
    label: "Check",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 17V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-3.5-2-2.5 2-2.5-2-2.5 2L3 17z" />
      </svg>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 17V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13l-7-4-7 4z" />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="11" width="4" height="7" rx="1" />
        <rect x="8" y="6" width="4" height="12" rx="1" />
        <rect x="14" y="2" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  {
    href: "/guide",
    label: "Guide",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="1" width="14" height="18" rx="2" />
        <path d="M7 5h6M7 9h6M7 13h4" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-border-default bg-bg-primary md:hidden">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium uppercase tracking-wider no-underline transition-colors ${
              isActive
                ? "border-t-2 border-accent-indigo-light bg-accent-indigo-bg text-accent-indigo-light"
                : "text-text-secondary"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
