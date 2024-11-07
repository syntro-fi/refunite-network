import { useEffect, useState } from "react";

import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import { getChainId, getPublicClient, getWalletClient } from "@wagmi/core";
import { usePublicClient } from "wagmi";

import { wagmiConfig } from "@/context";

export const useHatsClient = () => {
  const [hatsClient, setHatsClient] = useState<HatsClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const initHatsClient = async () => {
      if (!publicClient) {
        return;
      }
      try {
        setIsLoading(true);
        const chainId = getChainId(wagmiConfig);
        const walletClient = await getWalletClient(wagmiConfig);

        const client = new HatsClient({
          chainId,
          publicClient,
          walletClient,
        });

        setHatsClient(client);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to initialize Hats client"));
        setHatsClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    initHatsClient();
  }, [publicClient]);

  return {
    hatsClient,
    isLoading,
    error,
  };
};
