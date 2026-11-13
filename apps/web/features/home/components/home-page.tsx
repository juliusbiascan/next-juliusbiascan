"use client"

import { usePortfolio } from "@/features/site/api/portfolio"

import { getProfile } from "../services/get-profile"
import { GithubSection } from "./github-section"
import { Hero } from "./hero"
import { PortraitFeature } from "./portrait-feature"
import { SectionRule } from "./section-rule"
import { TechMarquee } from "./tech-marquee"
import { WorkTogether } from "./work-together"

export function HomePage() {
  const { data } = usePortfolio()
  if (!data) return null
  const profile = getProfile(data)

  return (
    <>
      <section className="overflow-x-clip bg-[linear-gradient(180deg,var(--background)_0%,var(--muted)_100%)] px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">
          <Hero profile={profile} />
          <PortraitFeature
            name={profile.name}
            roles={profile.experience}
            username={data.github.username}
          />
        </div>
      </section>

      <TechMarquee skills={profile.skills} />

      <SectionRule variant="dotted" />

      <GithubSection
        profileUrl={profile.githubHref}
        username={data.github.username}
      />

      <WorkTogether />
    </>
  )
}
