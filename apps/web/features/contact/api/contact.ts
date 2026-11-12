"use client"

import { useQuery } from "@tanstack/react-query"

import { portfolioQueryOptions } from "@/features/site/api/portfolio"
import { getContacts } from "../services/get-contacts"

export function useContacts() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getContacts(query.data) : undefined,
  }
}
