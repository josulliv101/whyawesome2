import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/components/AuthContext";
import { getCurrentUser } from "@/lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "whats awesome",
  description: "find out whats awesome about people and places",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthContextProvider user={user?.toJSON()}>
          {children}
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
