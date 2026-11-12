import type { Metadata } from "next"
import { Kode_Mono, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css"
import { getPortfolio } from "@repo/db"
import { PortfolioProvider } from "@/features/site/api/portfolio"
import { QueryProvider } from "@/features/site/components/query-provider"
import { SiteShell } from "@/features/site/components/site-shell"
import { ThemeProvider } from "@/features/site/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

export const dynamic = "force-dynamic"

const fontSans = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolio()

  return {
    title: {
      default: portfolio.name,
      template: `%s · ${portfolio.name}`,
    },
    description: `${portfolio.name}, ${portfolio.role}.`,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const portfolio = await getPortfolio()

  return (
    <html
      lang="en"
      suppressHydrationWarning

    >
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <QueryProvider>
          <PortfolioProvider initial={portfolio}>
            <ThemeProvider>
              <SiteShell>{children}</SiteShell>
            </ThemeProvider>
          </PortfolioProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
