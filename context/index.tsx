"use client";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import "@/app/globals.css";

import { wagmiConfig } from "@/wagmi/config";

const client = new QueryClient();

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
