import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-opt";
import { Inter } from "next/font/google";



const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "AutoCite-AI",
  description: "Created by Parth-12pm",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
