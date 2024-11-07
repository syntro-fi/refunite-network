import React from "react";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";

import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME!,
  description: "This is a hackathon project for public goods",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-foreground">
        <ContextProvider>
          <Header />
          <Toaster />
          {children}
          <footer className="border-t bg-indigo-100 p-6">
            <a
              className="flex items-center gap-2 transition-colors justify-center tracking-widest font-semibol text-foreground"
              href="http://example.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Refunite Network</span>
            </a>
          </footer>
        </ContextProvider>
      </body>
    </html>
  );
}
