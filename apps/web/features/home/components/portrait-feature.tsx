"use client"

import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"

import { useGitHubActivity } from "../api/github"
import type { Profile } from "../services/get-profile"
import { favoriteLanguage } from "../utils/languages"

function yearsOfExperience(roles: { dates: string }[], now = new Date()) {
  const currentYear = now.getFullYear()
  let start: number | null = null
  let end: number | null = null

  for (const role of roles) {
    const years = role.dates.match(/\d{4}/g)?.map(Number) ?? []
    if (years.length === 0) continue

    const roleStart = Math.min(...years)
    const ongoing = /present|current|now/i.test(role.dates)
    const roleEnd = ongoing ? currentYear : Math.max(...years)

    start = start === null ? roleStart : Math.min(start, roleStart)
    end = end === null ? roleEnd : Math.max(end, roleEnd)
  }

  if (start === null || end === null) return 0
  return Math.max(end - start, 1)
}

export function PortraitFeature({
  name,
  roles,
  username,
}: {
  name: string
  roles: Profile["experience"]
  username: string
}) {
  const years = yearsOfExperience(roles)
  const { data } = useGitHubActivity(username)
  const favorite = favoriteLanguage(data?.languages ?? [])

  return (
    <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem]">
      <style>{`
        @keyframes portrait-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .portrait-float {
          animation: portrait-float 5.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .portrait-float { animation: none; }
        }
      `}</style>

      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src="/julius-biascan.jpg"
          alt={name}
          fill
          priority
          sizes="(min-width: 640px) 304px, 272px"
          className="object-cover object-[center_18%]"
        />
      </div>

      <div
        className={cn(
          "portrait-float absolute top-10 left-0 z-10 -translate-x-1/4 rounded-xl border border-border bg-background/95 px-3.5 py-3 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-sm",
          "sm:-left-2"
        )}
      >
        <p className="text-3xl font-medium leading-none tabular-nums">
          {years}
          <span className="ml-1 text-sm font-normal text-muted-foreground">yr</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Experience</p>
      </div>

      {favorite ? (
        <div
          className={cn(
            "portrait-float absolute bottom-8 left-0 z-10 -translate-x-1/4 rounded-xl border border-border bg-background/95 px-3.5 py-3 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-sm [animation-delay:1.4s]",
            "sm:-left-2"
          )}
        >
          <p className="flex items-center gap-2 text-sm leading-tight font-medium">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: favorite.color }}
              aria-hidden="true"
            />
            {favorite.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Favorite</p>
        </div>
      ) : null}

      {roles.map((role, index) => (
        <div
          key={role.id}
          className={cn(
            "portrait-float absolute z-10 max-w-[11rem] rounded-xl border border-border bg-background/95 px-3 py-2.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-sm",
            index === 0
              ? "top-6 right-0 translate-x-1/4 [animation-delay:0.8s]"
              : "right-3 bottom-8 [animation-delay:1.6s] sm:-right-2"
          )}
        >
          <p className="text-sm leading-tight font-medium">{role.role}</p>
          <p className="mt-1 text-xs text-muted-foreground">{role.dates}</p>
        </div>
      ))}
    </div>
  )
}
