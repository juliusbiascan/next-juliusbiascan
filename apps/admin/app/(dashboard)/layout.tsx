import { getPortfolio } from "@repo/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardShell } from "@/features/site/components/dashboard-shell"
import { PortfolioProvider } from "@/features/site/api/portfolio"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const portfolio = await getPortfolio()

  return (
    <PortfolioProvider initial={portfolio}>
      <DashboardShell
        user={{
          name: session.user.name || "Admin",
          email: session.user.email,
        }}
      >
        {children}
      </DashboardShell>
    </PortfolioProvider>
  )
}
