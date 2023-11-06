import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata = {
  title: "Haikoo - Twitter clone, but Haikus only",
  description: "Twitter clone, but Haikus only",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`dark flex min-h-screen flex-col items-center bg-background ${rubik.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
