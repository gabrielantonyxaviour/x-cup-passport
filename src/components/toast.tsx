import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ExternalLink } from "lucide-react";
import { explorerTx } from "../config/chain";

type ToastKind = "pending" | "success" | "error";
type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  detail?: string;
  hash?: string;
};

type Ctx = {
  push: (t: Omit<Toast, "id">) => number;
  update: (id: number, patch: Partial<Omit<Toast, "id">>) => void;
  dismiss: (id: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts((prev) => [...prev, { ...t, id }]);
    if (t.kind !== "pending") setTimeout(() => dismiss(id), 6000);
    return id;
  };
  const update = (id: number, patch: Partial<Omit<Toast, "id">>) => {
    setToasts((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    );
    if (patch.kind && patch.kind !== "pending")
      setTimeout(() => dismiss(id), 6000);
  };
  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={{ push, update, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex w-[min(92vw,360px)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="card pointer-events-auto flex items-start gap-3 p-3.5"
            >
              <span className="mt-0.5 shrink-0">
                {t.kind === "pending" && (
                  <Loader2 size={18} className="animate-spin text-accent" />
                )}
                {t.kind === "success" && (
                  <CheckCircle2 size={18} className="text-accent" />
                )}
                {t.kind === "error" && (
                  <XCircle size={18} className="text-danger" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{t.title}</p>
                {t.detail && (
                  <p className="mt-0.5 text-xs text-muted">{t.detail}</p>
                )}
                {t.hash && (
                  <a
                    href={explorerTx(t.hash)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    View on explorer <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted hover:text-text"
                aria-label="Dismiss"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
