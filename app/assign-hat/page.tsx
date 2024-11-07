"use client";
import { useState } from "react";

import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { useHatsInteractions } from "@/hooks/useHatsInteractions";
import { useSafeOwner } from "@/hooks/useSafeOwner";

export default function AssignHatPage() {
  const { address: account, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isMultisigOwner, isLoading: isSafeLoading } = useSafeOwner();
  const { hatsInteractions, isConnected: isHatsConnected } = useHatsInteractions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isMultisigOwner) {
        throw new Error("Not authorized to create hats");
      }

      if (!isHatsConnected || !hatsInteractions) {
        throw new Error("Hats client not connected");
      }
      console.log("sending request");
      const result = await hatsInteractions.createAndMintHatSafe(recipient, name);

      if (result.success) {
        setName("");
        setRecipient("");
      }

      toast({
        variant: result.success ? "default" : "destructive",
        title: result.success ? "Success" : "Error",
        description: result.success
          ? `Successfully proposed hat creation and minting for ${name} (${recipient})`
          : result.error.message,
      });
    } catch (error) {
      console.error("the error", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Assign Hat</h1>
          <p className="text-base mb-6">Please connect your wallet to assign a hat.</p>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Assign Hat to Community Leader</h1>
        </header>

        {account && (
          <section>
            <h2 className="text-md text-indigo-600 font-semibold tracking-tight mb-3">
              Authorization Status
            </h2>
            <p className="text-sm">
              {isSafeLoading ? (
                "Checking permissions..."
              ) : isMultisigOwner ? (
                <span className="text-green-600 font-medium">
                  You can create and assign new hats as a Safe owner
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  You don&apos;t have permission to create new hats
                </span>
              )}
            </p>
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Assigning..." : "Assign Hat"}
          </Button>
        </form>
      </div>
    </div>
  );
}
