"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PortfolioContent } from "@repo/db/portfolio"

import {
  portfolioQueryKey,
  portfolioQueryOptions,
} from "@/features/site/api/portfolio"
import { saveContacts } from "@/lib/portfolio-actions"

import { getContacts } from "../services/get-contacts"

export function useContacts() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getContacts(query.data) : undefined,
  }
}

export function useSaveContacts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveContacts,
    onSuccess: (result) => {
      if (!result.ok) return
      queryClient.setQueryData<PortfolioContent>(portfolioQueryKey, (current) =>
        current ? { ...current, contacts: result.data.contacts } : current
      )
    },
  })
}
