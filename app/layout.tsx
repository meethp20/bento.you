import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import AuthSync from "@/components/auth/AuthSync";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/SmoothScroll";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bento - Your Link in Bio",
  description: "Share your world with a beautiful Bento grid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            forcedTheme="light"
          >
            <SmoothScroll>
              <AuthSync />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
