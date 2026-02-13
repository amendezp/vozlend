import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Echo Bank — AI Voice Underwriting",
  description:
    "Upload a voice memo to get instant AI-powered loan underwriting analysis. Transcription, scoring, and decisions in under a minute.",
  openGraph: {
    title: "Echo Bank — AI Voice Underwriting",
    description:
      "Your voice is your loan application. Upload a voice memo and get instant underwriting analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
