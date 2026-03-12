import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TourNest - Discover Your Perfect Destination",
  description: "Explore amazing destinations and book unforgettable tours with our AI-powered travel platform. Get personalized recommendations and create memories that last a lifetime.",
};

import { Suspense } from "react";
import GlobalLoader from "@/components/shared/GlobalLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-display`}
      >
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
        <Toaster
          position='top-center'
          richColors
          toastOptions={{
            style: {
              borderRadius: '1rem',
              border: '1px solid rgba(19, 139, 201, 0.1)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
