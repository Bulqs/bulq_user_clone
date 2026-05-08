import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
// import Footer from "./components/Footer";
// import Header from "./components/Header";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bulq",
  description: "Unbowed, Unbent, Unbroken Services",
  
  // 1. Favicon and Apple Touch Icons
  icons: {
    icon: '/images/logo4.svg', // Place this file in your /public folder
    apple: '/images/logo4.svg', // Useful for iOS home screens
  },

  // 2. Open Graph (Used by Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: 'Bulq',
    description: 'Unbowed, Unbent, Unbroken Service',
    url: 'https://www.sendbulq.com', // Replace with your actual domain
    siteName: 'Bulq',
    images: [
      {
        url: '/images/logo4.svg', // Place a 1200x630 image in your /public/images folder
        width: 1200,
        height: 630,
        alt: 'Bulq Logistics Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // 3. Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Bulq',
    description: 'Unbowed, Unbent, Unbroken Services',
    images: ['/images/logo4.svg'], // You can usually reuse the Open Graph image here
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Header /> */}
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
