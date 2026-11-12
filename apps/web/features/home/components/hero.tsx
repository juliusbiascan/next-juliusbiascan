import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import type { Profile } from "../services/get-profile"
import { socialIconPath } from "../utils/social-icons"

function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d={path} />
    </svg>
  )
}

export function Hero({ profile }: { profile: Profile }) {
  const socials = profile.contacts.flatMap((item) => {
    const path = socialIconPath(item.label)
    return path ? [{ ...item, path }] : []
  })
  const directContacts = profile.contacts.filter(
    (item) => item.label === "Email" || item.label === "Phone"
  )

  return (
    <div>
      <p className="text-sm text-muted-foreground">{profile.role}</p>
      <h1 className="mt-3 max-w-4xl text-2xl font-medium leading-none text-balance md:text-4xl lg:text-5xl">
        {profile.name}
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {profile.intro}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative inline-flex h-fit w-fit rounded-md">
          <span className="pointer-events-none absolute inset-0 rounded-md bg-border" />
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute top-1/2 left-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 animate-spin bg-[conic-gradient(from_0deg,transparent_0deg,transparent_220deg,#0091FF_250deg,#FF02F0_290deg,#F76808_325deg,#6647F0_350deg,transparent_360deg)] [animation-duration:3s]" />
          </span>
          <a
            href="/julius-biascan-resume.pdf"
            download="Julius-Biascan-Resume.pdf"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "relative z-10 m-px h-10 w-fit rounded-md border-transparent bg-background px-5 py-3 shadow-none hover:bg-background dark:bg-background dark:hover:bg-background"
            )}
          >
            Download resume
          </a>
        </div>
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-5")}
        >
          View my works
          <ChevronRightIcon data-icon="inline-end" />
        </Link>
      </div>
      <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {socials.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <SocialIcon path={item.path} />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-col gap-1 text-sm">
        {directContacts.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.value}
          </a>
        ))}
      </div>
    </div>
  )
}
