import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Copy, LogOut, IdCard, Check } from "lucide-react";
import { useXWallet, useBalance } from "../wallet/useXWallet";
import { fmtOKB, shortAddr } from "../lib/format";
import { Button } from "./ui";

export function WalletButton() {
  const {
    ready,
    authenticated,
    address,
    login,
    logout,
    exportWallet,
    walletType,
  } = useXWallet();
  const { balance } = useBalance(address);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!ready)
    return <div className="h-10 w-28 animate-pulse rounded-xl bg-surface-2" />;

  if (!authenticated || !address) {
    return (
      <Button onClick={login} className="h-10 px-4">
        Connect
      </Button>
    );
  }

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2" ref={ref}>
      {/* native balance pill — single-chain app, balance sits to the LEFT, no chain switcher */}
      <span className="hidden items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 sm:inline-flex">
        <span className="tabular text-sm text-text">
          {balance === undefined ? "…" : fmtOKB(balance, 4)}
        </span>
        <span className="text-xs font-medium text-muted">OKB</span>
      </span>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5 hover:border-accent/50"
        >
          <img
            src={`https://api.dicebear.com/9.x/shapes/svg?seed=${address}`}
            alt=""
            className="h-6 w-6 rounded-full"
          />
          <span className="tabular text-sm">{shortAddr(address)}</span>
        </button>

        {open && (
          <div className="card absolute right-0 z-30 mt-2 w-56 overflow-hidden p-1.5">
            <MenuItem
              icon={<IdCard size={15} />}
              label="My passport"
              onClick={() => {
                setOpen(false);
                navigate("/passport");
              }}
            />
            {walletType === "privy" && (
              <MenuItem
                icon={<Wallet size={15} />}
                label="Manage wallet"
                onClick={() => {
                  setOpen(false);
                  void exportWallet();
                }}
              />
            )}
            <MenuItem
              icon={
                copied ? (
                  <Check size={15} className="text-accent" />
                ) : (
                  <Copy size={15} />
                )
              }
              label={copied ? "Copied" : "Copy address"}
              onClick={copy}
            />
            <div className="my-1 h-px bg-border" />
            <MenuItem
              icon={<LogOut size={15} />}
              label="Disconnect"
              onClick={() => {
                setOpen(false);
                void logout();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-text hover:bg-surface-2"
    >
      <span className="text-muted">{icon}</span>
      {label}
    </button>
  );
}
