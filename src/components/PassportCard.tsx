import { motion } from "framer-motion";
import { parseTokenURI } from "../lib/passportMeta";

/**
 * Renders the LIVE on-chain passport NFT — the image comes straight from the
 * contract's tokenURI (fully on-chain SVG), so what you see is exactly what the
 * chain stores. No off-chain art.
 */
export function PassportCard({
  tokenURI,
  className = "",
  glow = true,
}: {
  tokenURI?: string;
  className?: string;
  glow?: boolean;
}) {
  const meta = parseTokenURI(tokenURI);

  return (
    <div className={`${glow ? "floodlight" : ""} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 14, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-[1] aspect-[360/500] w-full overflow-hidden rounded-[20px] border border-border shadow-2xl"
        style={{ perspective: 800 }}
      >
        {meta?.image ? (
          <img
            src={meta.image}
            alt={meta.name ?? "X Cup Passport"}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2 text-sm text-muted">
            Loading passport…
          </div>
        )}
      </motion.div>
    </div>
  );
}
