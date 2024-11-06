import React from "react";
import type { Metadata } from "next";

import ContextProvider from "@/context";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME!,
  description: "This is a hackathon project for public goods",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <Header />
          <Toaster />
          {children}
          <footer className="flex gap-6 flex-wrap items-center justify-center p-4 bg-[#F4EFEA]">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
