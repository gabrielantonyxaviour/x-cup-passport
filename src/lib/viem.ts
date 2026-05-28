import { createPublicClient, http } from "viem";
import { xLayerTestnet } from "../config/chain";

/** Shared read-only client for X Layer testnet. */
export const publicClient = createPublicClient({
  chain: xLayerTestnet,
  transport: http(),
});
