"use client"

import { usePortfolio } from "../api/portfolio"
import { getSite } from "../services/get-site"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { data } = usePortfolio()
  if (!data) return null
  const site = getSite(data)

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col border-x">
        <main className="flex-1">{children}</main>
        <SiteFooter name={site.name} email={site.email} />
      </div>
    </div>
  )
}
