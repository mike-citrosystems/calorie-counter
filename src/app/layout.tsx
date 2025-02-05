import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsCalendar3 } from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Application",
  description: "A Next.js application with shared layout",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Application",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <main className="pb-16">{children}</main>

        <button
          className="fixed right-4 bottom-20 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Add new item"
        >
          <AiOutlinePlus className="text-2xl" />
        </button>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto px-4">
            <ul className="flex items-center justify-center gap-16 py-3">
              <li>
                <Link
                  href="/planner"
                  className="flex flex-col items-center text-gray-600 hover:text-blue-500"
                >
                  <BsCalendar3 className="text-2xl" />
                  <span className="text-xs mt-1">Planner</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex flex-col items-center text-gray-600 hover:text-blue-500"
                >
                  <AiOutlineHome className="text-2xl" />
                  <span className="text-xs mt-1">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex flex-col items-center text-gray-600 hover:text-blue-500"
                >
                  <AiOutlineShoppingCart className="text-2xl" />
                  <span className="text-xs mt-1">Cart</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
