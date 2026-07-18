import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ background: '#FFF9FB', fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
