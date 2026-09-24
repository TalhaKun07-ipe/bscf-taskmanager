import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BSCF | Bangladesh Socio-Cultural Workspace",
  description: "AppFlowy-inspired task management, documentation, and community initiatives workspace for Bangladesh Socio-Cultural (BSCF).",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/bscf-symbol.png", type: "image/png" }
    ],
    shortcut: "/bscf-symbol.png",
    apple: "/bscf-symbol.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full bg-[#fbfbfa] text-zinc-900 paper-canvas overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
