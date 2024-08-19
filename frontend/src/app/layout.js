import { Inter } from "next/font/google";
import Providers from '@/components/layout/Providers';

import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
 
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clonestoxx",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <NextTopLoader />
          <Providers>
            <Toaster />
            <NextSSRPlugin
                 routerConfig={extractRouterConfig(ourFileRouter)}
        />
            {children}
          </Providers>
        </body>
    </html>
  );
}
