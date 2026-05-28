import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { xLayerTestnet } from "./config/chain";
import { PRIVY_APP_ID } from "./config/chain";
import { ToastProvider } from "./components/toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        defaultChain: xLayerTestnet,
        supportedChains: [xLayerTestnet],
        loginMethods: ["email", "google", "wallet"],
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        appearance: {
          theme: "dark",
          accentColor: "#2BE38B",
          logo: undefined,
          walletChainType: "ethereum-only",
        },
      }}
    >
      <ToastProvider>{children}</ToastProvider>
    </PrivyProvider>
  );
}
