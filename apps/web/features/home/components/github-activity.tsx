"use client"

import { GithubSection, GithubSectionFallback } from "./github-section"

export function GithubActivity({
  profileUrl,
  username,
}: {
  profileUrl: string
  username: string
}) {
  if (!username) return <GithubSectionFallback />

  return <GithubSection profileUrl={profileUrl} username={username} />
}
