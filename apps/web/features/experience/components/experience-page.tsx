"use client"

import { PageHeading } from "@/features/site/components/page-heading"

import { useExperience } from "../api/experience"
import { TechIcon } from "./tech-icon"

export function ExperiencePage() {
  const { data } = useExperience()
  if (!data) return null

  return (
    <>
      <PageHeading
        title="Experience"
        description="Work history and skills."
      />
      <ul className="divide-y border-t">
        {data.jobs.map((job) => (
          <li
            key={job.id}
            className="grid gap-2 px-6 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:px-10"
          >
            <p className="text-sm text-muted-foreground">{job.dates}</p>
            <div>
              <h2 className="text-base font-medium">{job.role}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <section>
        <div className="border-t px-6 py-4 sm:px-10">
          <h2 className="text-sm text-muted-foreground">Skills</h2>
        </div>
        <div className="grid grid-cols-1 gap-px border-t bg-border sm:grid-cols-2">
          {data.skills.map((group) => (
            <div key={group.title} className="bg-background px-6 py-8 sm:px-10">
              <h3 className="text-sm font-medium">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <TechIcon name={item} className="size-3.5 shrink-0 text-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
