import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Orders Management",
  description: "Fullstack orders management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
