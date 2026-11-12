import { ProjectsEditor } from "@/features/projects/components/projects-editor"
import { PageHeading } from "@/features/site/components/page-heading"

export default function ProjectsPage() {
  return (
    <>
      <PageHeading
        title="Projects"
        description="Work shown on the public projects page."
      />
      <ProjectsEditor />
    </>
  )
}
