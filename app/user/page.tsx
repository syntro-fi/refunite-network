"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { abi as HatsAbi } from "@/lib/hatsAbi";

export default function AccountPage() {
  const { address, isConnected } = useAccount();
  const [hatId, setHatId] = useState<string | null>(null);

  const hatsContractAddress = "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137"; // Hats protocol contract address
  const hatsId = "0x0000027000020000000000000000000000000000000000000000000000000000"; // https://app.hatsprotocol.xyz/trees/11155111/624?hatId=624.2

  const {
    data: hatData,
    isError,
    isLoading,
  } = useReadContract({
    address: hatsContractAddress,
    abi: HatsAbi,
    functionName: "viewHat",
    args: [hatsId],
    enabled: isConnected,
  });

  useEffect(() => {
    if (hatData) {
      setHatId(hatData.toString());
    }
  }, [hatData]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Please connect your wallet to view your account details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Your Refunite network information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://robohash.org/${address}`} alt="User avatar" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Community Leader</h2>
              <p className="text-sm text-muted-foreground">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hat Status</h3>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : isError ? (
              <Badge variant="destructive">Error loading Hat data</Badge>
            ) : hatId ? (
              <Badge variant="default">Hat ID: {hatId}</Badge>
            ) : (
              <Badge variant="secondary">No Hat assigned</Badge>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => alert("View Hat details")}>
                View Hat Details
              </Button>
              <Link href="/recover-role" passHref>
                <Button className="w-full" variant="outline">
                  Recover Role
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
