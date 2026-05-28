import { NavLink, Outlet, Link } from "react-router-dom";
import { CalendarDays, Flame, Trophy, IdCard } from "lucide-react";
import { WalletButton } from "./WalletButton";

const NAV = [
  { to: "/matchday", label: "Matchday", icon: CalendarDays },
  { to: "/banter", label: "Banter", icon: Flame },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/passport", label: "My Passport", icon: IdCard },
];

export function AppShell() {
  return (
    <div className="grain min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="X Cup Passport"
              className="h-9 w-9 rounded-lg"
            />
            <span className="font-display text-lg font-semibold tracking-tight">
              X Cup Passport
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-surface-2 text-text"
                      : "text-muted hover:text-text"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <WalletButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        <Outlet />
      </main>

      {/* mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] ${
                isActive ? "text-accent" : "text-muted"
              }`
            }
          >
            <n.icon size={19} />
            {n.label.replace("My ", "")}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
