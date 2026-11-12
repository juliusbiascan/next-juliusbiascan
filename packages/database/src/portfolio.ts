import { Prisma } from "./generated/prisma/client"

import { db } from "./db"
import { defaultPortfolio } from "./portfolio-default"
import {
  portfolioContentSchema,
  type PortfolioContent,
} from "./portfolio-schema"

function toJson(content: PortfolioContent): Prisma.InputJsonValue {
  return content as Prisma.InputJsonValue
}

export async function getPortfolio(): Promise<PortfolioContent> {
  const existing = await db.portfolio.findUnique({ where: { id: 1 } })
  if (existing) {
    return portfolioContentSchema.parse(existing.content)
  }

  try {
    const created = await db.portfolio.create({
      data: { id: 1, content: toJson(defaultPortfolio) },
    })
    return portfolioContentSchema.parse(created.content)
  } catch {
    const row = await db.portfolio.findUniqueOrThrow({ where: { id: 1 } })
    return portfolioContentSchema.parse(row.content)
  }
}

export async function savePortfolio(
  content: PortfolioContent
): Promise<PortfolioContent> {
  const parsed = portfolioContentSchema.parse(content)
  const row = await db.portfolio.upsert({
    where: { id: 1 },
    create: { id: 1, content: toJson(parsed) },
    update: { content: toJson(parsed) },
  })
  return portfolioContentSchema.parse(row.content)
}
