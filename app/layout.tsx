import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import IntroBoot from "@/components/IntroBoot";
import ScrollNavClass from "@/components/ScrollNavClass";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif"
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Amit — Web Developer & Digital Builder",
  description:
    "Amit designs and builds fast, modern websites and digital experiences for ambitious businesses.",
  openGraph: {
    title: "Amit — Web Developer & Digital Builder",
    description:
      "Amit designs and builds fast, modern websites and digital experiences for ambitious businesses.",
    url: siteUrl,
    siteName: "Amit.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Amit — Web Developer & Digital Builder",
    description:
      "Amit designs and builds fast, modern websites and digital experiences for ambitious businesses."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <ScrollNavClass />
        <CustomCursor />
        <IntroBoot />
        {children}
      </body>
    </html>
  );
}
