"use client";

import { useEffect, useState } from "react";

import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import { getAddress } from "viem";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { useHatsClient } from "@/hooks/useHatsClient";

// This is a placeholder function. In a real implementation, this would interact with the Hats protocol.
async function mintHat(
  hatsClient: HatsClient,
  hatter: string,
  recipient: string,
  hatId: bigint
): Promise<boolean> {
  return await hatsClient.mintHat({
    account: getAddress(hatter),
    hatId,
    wearer: getAddress(recipient),
  });
}

export default function AssignHatPage() {
  const { address: account } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { hatsClient, isLoading: isHatsClientLoading, error: hatsClientError } = useHatsClient();
  const { toast } = useToast();
  const [isWearer, setIsWearer] = useState(false);

  //TODO add dropdown for selection of hat to mint

  useEffect(() => {
    const getWearerStatus = async () => {
      if (isHatsClientLoading || !hatsClient || !account) {
        console.log({ isHatsClientLoading, hatsClient, account });
        return;
      }
      const isWearer = await hatsClient.isWearerOfHat({
        wearer: getAddress(account),
        hatId: BigInt("0x0000027000020001000000000000000000000000000000000000000000000000"),
      });

      console.log(isWearer);

      setIsWearer(isWearer);
    };
    getWearerStatus();
  }, [hatsClient, account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!hatsClient) {
        throw new Error("HatsClient not initialized");
      }
      const success = await hatsClient.mintHat({
        account: getAddress(account),
        hatId: BigInt("0x0000027000020001000100000000000000000000000000000000000000000000"),
        wearer: getAddress(recipient),
      });
      toast({
        variant: success ? "default" : "destructive",
        title: success ? "Success" : "Error",
        description: success
          ? `Successfully assigned a Hat to ${name} (${recipient})`
          : "Failed to assign Hat. Please try again.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while assigning the Hat. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Assign Hat to Community Leader</CardTitle>
          <CardDescription>Use this form to mint a new Hat for a community leader</CardDescription>
        </CardHeader>
        <CardContent>
          {account && (
            <div className="mb-4 p-3 rounded-lg bg-secondary">
              <p className="text-sm flex items-center">
                Hat Status:{" "}
                {isHatsClientLoading ? (
                  <span>Checking...</span>
                ) : isWearer ? (
                  <span className="text-green-600 font-medium">User has the required hat</span>
                ) : (
                  <span className="text-red-600 font-medium">
                    User does not have the required hat
                  </span>
                )}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Leader Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign Hat"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
