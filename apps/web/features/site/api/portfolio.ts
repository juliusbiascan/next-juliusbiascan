"use client"

import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  portfolioContentSchema,
  type PortfolioContent,
} from "@repo/db/portfolio"
import Pusher from "pusher-js"
import { useEffect } from "react"

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

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    if (!key || !cluster) return

    const pusher = new Pusher(key, { cluster })
    const channel = pusher.subscribe("portfolio")

    function onUpdate(payload: unknown) {
      const parsed = portfolioContentSchema.safeParse(payload)
      if (!parsed.success) return

      const previous = queryClient.getQueryData<PortfolioContent>(portfolioQueryKey)
      queryClient.setQueryData(portfolioQueryKey, parsed.data)

      if (previous?.github.username !== parsed.data.github.username) {
        void queryClient.invalidateQueries({ queryKey: ["github", "activity"] })
      }
    }

    channel.bind("content.updated", onUpdate)
    return () => {
      channel.unbind("content.updated", onUpdate)
      pusher.unsubscribe("portfolio")
      pusher.disconnect()
    }
  }, [queryClient])

  return children
}
