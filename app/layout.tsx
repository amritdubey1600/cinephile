import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Cinephile",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
