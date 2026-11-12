"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PortfolioContent } from "@repo/db/portfolio"

import {
  portfolioQueryKey,
  portfolioQueryOptions,
} from "@/features/site/api/portfolio"
import { saveExperience } from "@/lib/portfolio-actions"

import { getExperience } from "../services/get-experience"

export function useExperience() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getExperience(query.data) : undefined,
  }
}

export function useSaveExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveExperience,
    onSuccess: (result) => {
      if (!result.ok) return
      queryClient.setQueryData<PortfolioContent>(portfolioQueryKey, (current) =>
        current ? { ...current, experience: result.data.experience } : current
      )
    },
  })
}
