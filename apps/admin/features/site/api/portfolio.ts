"use client"

import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  portfolioContentSchema,
  type PortfolioContent,
} from "@repo/db/portfolio"

export const portfolioQueryKey = ["portfolio"] as const

export const portfolioQueryOptions = queryOptions({
  queryKey: portfolioQueryKey,
  queryFn: async (): Promise<PortfolioContent> => {
    const response = await fetch("/api/portfolio")
    if (!response.ok) {
      throw new Error("Portfolio unavailable")
    }
    return portfolioContentSchema.parse(await response.json())
  },
  staleTime: Infinity,
})

export function usePortfolio() {
  return useQuery(portfolioQueryOptions)
}

export function PortfolioProvider({
  initial,
  children,
}: {
  initial: PortfolioContent
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  if (queryClient.getQueryData(portfolioQueryKey) === undefined) {
    queryClient.setQueryData(portfolioQueryKey, initial)
  }

  return children
}
