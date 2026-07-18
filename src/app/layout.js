import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Playfair_Display, Inter } from "next/font/google";
import { StoreProvider } from "@/providers/StoreProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "BeautyVault — Discover Beauty Without Limits",
    template: "%s | BeautyVault",
  },
  description:
    "Shop your favorite makeup, skincare and beauty essentials from the world's top brands. BeautyVault is your premium multi-brand beauty marketplace.",
  keywords: ["beauty", "makeup", "skincare", "cosmetics", "luxury beauty", "online beauty store"],
  openGraph: {
    title: "BeautyVault — Discover Beauty Without Limits",
    description: "Shop premium makeup, skincare and beauty essentials from the world's top brands.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col antialiased ${playfair.variable} ${inter.variable}`}
        style={{ background: '#FFF9FB', fontFamily: "var(--font-body), system-ui, sans-serif" }}
      >
        <StoreProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
