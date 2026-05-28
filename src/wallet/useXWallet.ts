import { useCallback, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  createWalletClient,
  custom,
  type Address,
  type WalletClient,
} from "viem";
import { xLayerTestnet, GAS_FLOOR_WEI } from "../config/chain";
import { publicClient } from "../lib/viem";

export function useXWallet() {
  const { ready, authenticated, login, logout, exportWallet, user } =
    usePrivy();
  const { wallets } = useWallets();

  // Prefer an embedded Privy wallet; fall back to the first connected external one (e.g. OKX).
  const wallet =
    wallets.find((w) => w.walletClientType === "privy") ?? wallets[0];
  const address = wallet?.address as Address | undefined;

  const getWalletClient = useCallback(async (): Promise<WalletClient> => {
    if (!wallet) throw new Error("No wallet connected");
    try {
      await wallet.switchChain(xLayerTestnet.id);
    } catch {
      /* some external wallets prompt; ignore and let the tx surface the chain error */
    }
    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
      account: wallet.address as Address,
      chain: xLayerTestnet,
      transport: custom(provider),
    });
  }, [wallet]);

  return {
    ready,
    authenticated,
    address,
    login,
    logout,
    exportWallet,
    getWalletClient,
    email: user?.email?.address,
    walletType: wallet?.walletClientType,
  };
}

/** Native OKB balance + gas affordability for the connected address. */
export function useBalance(address?: Address) {
  const [balance, setBalance] = useState<bigint | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!address) {
      setBalance(undefined);
      return;
    }
    try {
      setBalance(await publicClient.getBalance({ address }));
    } catch {
      setBalance(undefined);
    }
  }, [address]);

  useEffect(() => {
    void refresh();
    if (!address) return;
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [address, refresh]);

  const hasGas = balance !== undefined && balance >= GAS_FLOOR_WEI;
  return { balance, hasGas, refresh };
}
