import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sir Xolo Academy | Interactive Foundation Phase Learning",
  description:
    "Step-by-step interactive learning in English, Mathematics, and isiZulu for Foundation Phase learners. Master skills at your own pace.",
  manifest: "/manifest.json",
  applicationName: "Sir Xolo Academy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sir Xolo Academy",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-300 selection:text-slate-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
          <p>© 2026 SIR XOLO ACADEMY. All rights reserved.</p>
          <p className="mt-1">Empowering Foundation Phase learners in South Africa.</p>
        </footer>
      </body>
    </html>
  );
}
