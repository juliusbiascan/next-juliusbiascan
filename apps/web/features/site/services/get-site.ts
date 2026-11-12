import type { PortfolioContent } from "@repo/db/portfolio"

export function getSite(portfolio: PortfolioContent) {
  const email = portfolio.contacts.find((item) => item.label === "Email")

  return {
    name: portfolio.name,
    role: portfolio.role,
    description: `${portfolio.name}, ${portfolio.role}.`,
    navigation: portfolio.navigation,
    email: email ? { href: email.href, value: email.value } : null,
  }
}

export type SiteData = ReturnType<typeof getSite>
