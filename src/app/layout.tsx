import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {
  IoHomeOutline,
  IoCalendarOutline,
  IoSettingsOutline,
} from "react-icons/io5";

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <style>
          {`
            html, body {
              touch-action: pan-x pan-y;
              -webkit-touch-callout: none;
            }
          `}
        </style>
      </head>
      <body className={`${inter.className} fixed inset-0 overflow-hidden`}>
        <main className="h-full overflow-auto pb-16">{children}</main>

        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-2 flex gap-6">
          <Link
            href="/"
            className={`p-2 text-gray-500 hover:text-blue-500 transition-colors`}
          >
            <IoHomeOutline className="w-6 h-6" />
          </Link>
          <Link
            href="/history"
            className={`p-2 text-gray-500 hover:text-blue-500 transition-colors`}
          >
            <IoCalendarOutline className="w-6 h-6" />
          </Link>
          <Link
            href="/settings"
            className={`p-2 text-gray-500 hover:text-blue-500 transition-colors`}
          >
            <IoSettingsOutline className="w-6 h-6" />
          </Link>
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
