import { ExperienceEditor } from "@/features/experience/components/experience-editor"
import { PageHeading } from "@/features/site/components/page-heading"

export default function ExperiencePage() {
  return (
    <>
      <PageHeading
        title="Experience"
        description="Roles published on the public experience page."
      />
      <ExperienceEditor />
    </>
  )
}
