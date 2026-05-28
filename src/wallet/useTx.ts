import { useCallback } from "react";
import type { Abi, Address } from "viem";
import { publicClient } from "../lib/viem";
import { useToast } from "../components/toast";
import { useXWallet } from "./useXWallet";

type TxArgs = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  pending: string;
  success: string;
};

function humanError(e: unknown): string {
  const msg =
    (e as { shortMessage?: string; message?: string })?.shortMessage ||
    (e as Error)?.message ||
    "Transaction failed";
  if (/user rejected|denied/i.test(msg)) return "You rejected the request";
  if (/insufficient funds/i.test(msg)) return "Insufficient OKB for gas";
  return msg.length > 120 ? msg.slice(0, 117) + "…" : msg;
}

/** Sends a single write tx with toast feedback (pending → success/error) and waits for the receipt. */
export function useTx() {
  const { getWalletClient, address } = useXWallet();
  const toast = useToast();

  return useCallback(
    async (tx: TxArgs): Promise<`0x${string}` | null> => {
      const id = toast.push({ kind: "pending", title: tx.pending });
      try {
        const wallet = await getWalletClient();
        // Simulate first to surface reverts before the wallet prompt.
        const { request } = await publicClient.simulateContract({
          account: address,
          address: tx.address,
          abi: tx.abi,
          functionName: tx.functionName,
          args: tx.args as never,
        });
        const hash = await wallet.writeContract(request);
        toast.update(id, {
          title: tx.pending,
          detail: "Confirming on X Layer…",
          hash,
        });
        await publicClient.waitForTransactionReceipt({ hash });
        toast.update(id, {
          kind: "success",
          title: tx.success,
          hash,
          detail: undefined,
        });
        return hash;
      } catch (e) {
        toast.update(id, {
          kind: "error",
          title: "Transaction failed",
          detail: humanError(e),
        });
        return null;
      }
    },
    [getWalletClient, address, toast],
  );
}
