"use client";

import React, { useState } from "react";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getAddress, Hex } from "viem";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWalletClient } from "wagmi";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { abi as HatsAbi } from "@/lib/hatsAbi";

export default function RecoverRolePage() {
  const publicClient = usePublicClient();
  const { data: walletClient, isLoading } = useWalletClient();
  const { isConnected } = useAccount();
  const [peerAddress, setPeerAddress] = useState("");

  const hatsContractAddress = "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137"; // Sepolia testnet address
  const [txHash, setTxHash] = useState("");
  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash as Hex,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicClient) {
      console.log("PANIC");
      return;
    }

    const hatsId = BigInt("0x0000027000020000000000000000000000000000000000000000000000000000"); // https://app.hatsprotocol.xyz/trees/11155111/624?hatId=624.2

    const { request } = await publicClient.simulateContract({
      address: hatsContractAddress,
      abi: HatsAbi,
      functionName: "mintHat",
      args: [hatsId, getAddress(peerAddress)],
    });

    if (!request || !walletClient) {
      console.log("PANIC STUFF IS MISSING");
      return;
    }

    const txHash = await walletClient.writeContract(request);
    console.log("txHash", txHash);

    setTxHash(txHash);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Recover Role</CardTitle>
            <CardDescription>Please connect your wallet to recover your role.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recover Role</CardTitle>
          <CardDescription>Enter the address of a peer to recover your role</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="peerAddress">Peer Wallet Address</Label>
              <Input
                id="peerAddress"
                placeholder="0x..."
                value={peerAddress}
                onChange={(e) => setPeerAddress(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isConnected}>
              {isLoading ? "Recovering..." : "Recover Role"}
            </Button>
          </form>

          {(isSuccess || isError) && (
            <Alert className={`mt-4 ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{isSuccess ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {isSuccess
                  ? "Your role has been successfully recovered."
                  : "An error occurred while recovering your role. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
