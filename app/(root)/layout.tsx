import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "../globals.css";

import Bottombar from "@/components/shared/Bottombar";

import Topbar from "@/components/shared/Topbar";

import Rightsidebar from "@/components/shared/RightSidebar";
import { connectToDB } from "@/lib/mongoose";
import Leftsidebar from "@/components/shared/LeftSidebar";
connectToDB();
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <body className={inter.className}>
          <Topbar />

          <main className='flex flex-row'>
            
            <Leftsidebar />
            <section className='main-container'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            {}
            <Rightsidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}