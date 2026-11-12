"use client"

import { useQuery } from "@tanstack/react-query"

import { getSite } from "../services/get-site"
import { portfolioQueryOptions } from "./portfolio"

export function useSite() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getSite(query.data) : undefined,
  }
}
