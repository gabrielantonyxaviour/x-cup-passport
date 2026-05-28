import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "accent",
  loading,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "accent" | "ghost" | "outline";
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 h-11 text-sm font-semibold transition disabled:cursor-not-allowed";
  const variants = {
    accent: "btn-accent",
    ghost: "text-text hover:bg-surface-2 disabled:opacity-40",
    outline:
      "border border-border text-text hover:border-accent/60 hover:text-accent disabled:opacity-40",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Pill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted">
      <Loader2 className="animate-spin text-accent" size={18} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <h3 className="text-lg">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{body}</p>
      {action}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
      {children}
    </span>
  );
}

export function DemoTag() {
  return (
    <Pill className="border border-gold/30 bg-gold/10 text-gold">
      Pre-tournament simulation
    </Pill>
  );
}
