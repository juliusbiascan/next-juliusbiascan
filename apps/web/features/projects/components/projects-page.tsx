"use client"

import { PageHeading } from "@/features/site/components/page-heading"
import { cn } from "@workspace/ui/lib/utils"

import { useProjects } from "../api/projects"
import { spansFullWidth } from "../utils/grid"

export function ProjectsPage() {
  const { data } = useProjects()
  if (!data) return null

  return (
    <>
      <PageHeading
        title="Projects"
        description="Selected work."
      />
      <div className="grid grid-cols-1 gap-px border-t bg-border sm:grid-cols-2">
        {data.map((project, index) => (
          <a
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex h-full flex-col gap-3 bg-background px-6 py-8 transition-colors hover:bg-muted sm:px-10",
              spansFullWidth(data.length, index) && "sm:col-span-2"
            )}
          >
            <h2 className="text-base font-medium">{project.title}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
            <p className="mt-auto pt-4 text-xs text-muted-foreground">
              {project.stack.join(" · ")}
            </p>
          </a>
        ))}
      </div>
    </>
  )
}
