import type { PortfolioContent } from "@repo/db/portfolio"

export { defaultPortfolio as site } from "@repo/db"

export type ContactItem = PortfolioContent["contacts"][number]
