import type { PortfolioContent } from "@repo/db/portfolio"

export function getContacts(portfolio: PortfolioContent) {
  return portfolio.contacts
}

export type ContactsData = ReturnType<typeof getContacts>
