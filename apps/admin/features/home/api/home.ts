"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PortfolioContent } from "@repo/db/portfolio"

import {
  portfolioQueryKey,
  portfolioQueryOptions,
} from "@/features/site/api/portfolio"
import { saveHomeSection } from "@/lib/portfolio-actions"

import { getHome } from "../services/get-home"

export function useHome() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getHome(query.data) : undefined,
  }
}

export function useSaveHome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveHomeSection,
    onSuccess: (result) => {
      if (!result.ok) return
      queryClient.setQueryData<PortfolioContent>(portfolioQueryKey, (current) =>
        current ? { ...current, ...result.data } : current
      )
    },
  })
}
