import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
