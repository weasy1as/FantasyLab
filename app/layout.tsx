import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LandingNavBar from "@/components/LandingNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fantasy Lab",
  description:
    "Fantasy Lab is a platform to explore Premier League players, analyze detailed stats, and get AI-powered insights to improve your Fantasy Premier League (FPL) selections.",
  icons: {
    icon: "/FPL.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
      >
        {/* navbar sits on every page; dark body prevents flash of white when header is transparent */}
        <LandingNavBar />
        {children}
      </body>
    </html>
  );
}
