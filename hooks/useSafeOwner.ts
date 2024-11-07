import { useEffect, useState } from "react";

import SafeApiKit from "@safe-global/api-kit";
import { useAccount } from "wagmi";

import { ATLANTIS_SAFE_ADDRESS, SEPOLIA_CHAIN_ID } from "@/lib/constants";

export const useSafeOwner = () => {
  const { address: account } = useAccount();
  const [isMultisigOwner, setIsMultisigOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkSafeOwnership = async () => {
      if (!account) {
        setIsMultisigOwner(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const safeService = new SafeApiKit({
          chainId: BigInt(SEPOLIA_CHAIN_ID),
        });

        // Get Safe info
        const safeInfo = await safeService.getSafeInfo(ATLANTIS_SAFE_ADDRESS);
        const owners = safeInfo.owners;

        setIsMultisigOwner(
          owners.map((owner) => owner.toLowerCase()).includes(account.toLowerCase())
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to check Safe ownership"));
        setIsMultisigOwner(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSafeOwnership();
  }, [account]);

  return {
    isMultisigOwner,
    isLoading,
    error,
  };
};
