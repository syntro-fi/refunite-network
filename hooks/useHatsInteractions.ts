"use client";
import { MultiCallResult } from "@hatsprotocol/sdk-v1-core";
import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import { getAddress, Hex } from "viem";
import { useAccount } from "wagmi";

import { useHatsClient } from "./useHatsClient";

import { ATLANTIS_HAT_ID, ATLANTIS_SAFE_ADDRESS } from "@/lib/constants";

type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

type CallData = {
  functionName: string;
  callData: Hex;
};

interface CreateHatData {
  createHatCalldata: CallData;
  mintHatCalldata: CallData;
  nextHatId: bigint;
}

interface HatsInteractions {
  createAndMintHat: (recipient: string, name: string) => Promise<Result<MultiCallResult, Error>>;
}

export const useHatsInteractions = () => {
  const { hatsClient, isLoading: isClientLoading } = useHatsClient();
  const { address } = useAccount();

  if (!hatsClient) {
    return {
      hatsInteractions: null,
      isConnected: false,
    };
  }

  const interactions: HatsInteractions = {
    createAndMintHat: async (recipient: string, name: string) => {
      if (!address) {
        return {
          success: false,
          error: new Error("No wallet connected"),
        };
      }

      const data = await buildHatData(hatsClient, recipient, name);
      if (!data) {
        throw new Error("Failed to construct hat transaction data");
      }

      try {
        const result = await hatsClient.multicall({
          account: address,
          calls: [data.createHatCalldata, data.mintHatCalldata],
        });

        return {
          success: true,
          data: result,
        };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err : new Error("Failed to create and mint hat"),
        };
      }
    },
  };

  return {
    hatsInteractions: interactions,
    isConnected: !!address && !isClientLoading,
  };
};

async function buildHatData(
  hatsClient: HatsClient,
  recipient: string,
  name: string
): Promise<CreateHatData | undefined> {
  if (!recipient || !name) {
    return undefined;
  }

  try {
    const createHatCalldata = hatsClient.createHatCallData({
      admin: BigInt(ATLANTIS_HAT_ID),
      details: name,
      maxSupply: 1,
      eligibility: ATLANTIS_SAFE_ADDRESS,
      toggle: ATLANTIS_SAFE_ADDRESS,
      mutable: true,
    });

    const children = await hatsClient.getChildrenHats(BigInt(ATLANTIS_HAT_ID));
    const nextHatId = (
      await hatsClient.predictNextChildrenHatIDs({
        admin: BigInt(ATLANTIS_HAT_ID),
        numChildren: children.length,
      })
    )[0];

    const mintHatCalldata = hatsClient.mintHatCallData({
      hatId: nextHatId,
      wearer: getAddress(recipient),
    });

    return {
      createHatCalldata,
      mintHatCalldata,
      nextHatId,
    };
  } catch (err) {
    return undefined;
  }
}
