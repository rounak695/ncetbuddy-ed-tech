import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/context/AnalyticsContext";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import RefTracker from "@/components/RefTracker";

import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"] });

const BASE_URL = "https://www.ncetbuddy.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "NCET Buddy — #1 NCET Mock Test & Preparation Platform",
    template: "%s | NCET Buddy",
  },
  description:
    "India's best NCET preparation platform. Attempt free & premium NCET mock tests, explore NCET syllabus 2025-26, check participating colleges (IITs, NITs, RIEs) and crack the National Common Entrance Test for ITEP with top scores.",
  keywords: [
    "NCET",
    "NCET 2025",
    "NCET 2026",
    "NCET mock test",
    "NCET preparation",
    "NCET syllabus",
    "NCET exam",
    "National Common Entrance Test",
    "ITEP",
    "Integrated Teacher Education Programme",
    "NCET NTA",
    "NCET participating colleges",
    "NCET IIT",
    "NCET NIT",
    "NRT NCET",
    "NCET online test series",
    "NCET free mock test",
    "NCET question paper",
    "NCET result",
    "NCET cut off",
  ],
  authors: [{ name: "NCET Buddy", url: BASE_URL }],
  creator: "NCET Buddy",
  publisher: "NCET Buddy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "NCET Buddy",
    title: "NCET Buddy — #1 NCET Mock Test & Preparation Platform",
    description:
      "India's #1 platform for NCET preparation. Free & premium mock tests, syllabus, PYQs, and expert strategy to crack the ITEP entrance exam.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NCET Buddy — Crack NCET 2025-26",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NCET Buddy — #1 NCET Mock Test & Preparation Platform",
    description:
      "India's #1 platform for NCET preparation. Free & premium mock tests, syllabus, PYQs, and expert strategy.",
    images: ["/og-image.png"],
    creator: "@ncetbuddy",
  },
  verification: {
    google: "your-google-site-verification-code", // Replace with actual code from Google Search Console
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme === 'system' || !savedTheme ? systemTheme : savedTheme;
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <Suspense fallback={null}>
                <RefTracker />
              </Suspense>
              {children}
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
