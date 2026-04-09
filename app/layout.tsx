import "../lib/fonts/_active.css";
import "../lib/fonts/_vars.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Default Setting",
  description: "Webサイト制作用の初期設定環境",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased font-body"
      >
      
        {children}
        <Script
          src="https://site-annotator.vercel.app/tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
