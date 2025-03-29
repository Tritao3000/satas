import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { Arimo } from "next/font/google";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Satas",
  description: "Social Aid for Talent Acquisition Startups",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const arimo = Arimo({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const garet = localFont({
  src: "../public/fonts/Garet-Book.woff2",
  display: "swap",
  variable: "--font-garet",

  style: "normal",
});

const garetHeavy = localFont({
  src: "../public/fonts/Garet-Heavy.woff2",
  display: "swap",
  variable: "--font-garet-heavy",
  weight: "700",
  style: "normal",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${arimo.className} ${garet.variable} ${garetHeavy.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
