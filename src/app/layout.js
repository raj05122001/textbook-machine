import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Main from "./Main";
import Head from "next/head";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Textbook Machine",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Main>
        {children}
        </Main>
      </body>
    </html>
  );
}
